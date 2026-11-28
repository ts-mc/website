import { Matrix4, Raycaster, Vector2, Vector3 } from "three";

// Instanced block models are positioned by their schematic coordinates. A hit
// on the edge of a wall-mounted lever still belongs to that exact instance.
export function pickBlock(canvas, camera, group, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const pointer = new Vector2(
    2 * (clientX - rect.left) / rect.width - 1,
    1 - 2 * (clientY - rect.top) / rect.height,
  );
  const ray = new Raycaster();
  ray.setFromCamera(pointer, camera);
  const meshes = [];
  group.traverseVisible(object => { if (object.isMesh) meshes.push(object); });
  const hit = ray.intersectObjects(meshes, false)[0];
  if (!hit) return null;
  const mesh = hit.object;
  if (hit.instanceId !== undefined) {
    const matrix = new Matrix4();
    mesh.getMatrixAt(hit.instanceId, matrix);
    return new Vector3().setFromMatrixPosition(matrix).round().toArray();
  }
  if (mesh.name.startsWith("overflow_")) return mesh.position.toArray();
  return null;
}

// Keep the original textured schematic. Simulation snapshots have independent
// palettes and own WASM memory, so copy only changed circuit block states.
export function createRedstonePlayback(renderer, schematic, blocks, afterRender, onError, onTick) {
  const source = schematic.schematicWrapper;
  const circuit = blocks.filter(block => block.category === "redstone" || block.category === "rail");
  let world = source.create_simulation_world();
  const initial = circuit.map(({ x, y, z }) => source.get_block_string(x, y, z));
  let speed = 1;
  let disposed = false;
  let rendering = false;
  let pending = false;
  let timer;
  let ticks = 0;
  let paletteSize = source.get_all_palettes().default.length;

  async function refresh() {
    pending = true;
    if (rendering || disposed) return;
    rendering = true;
    try {
      while (pending && !disposed) {
        pending = false;
        world.sync_to_schematic();
        const snapshot = world.get_schematic();
        let changed = false;
        try {
          for (const { x, y, z } of circuit) {
            const state = snapshot.get_block_string(x, y, z);
            const current = source.get_block_string(x, y, z);
            // Unsupported blocks can map to air in the circuit simulator.
            if (state && state !== current && state.split("[", 1)[0] === current?.split("[", 1)[0]) {
              source.set_block_from_string(x, y, z, state);
              changed = true;
            }
          }
        } finally {
          snapshot.free();
        }
        if (!changed) continue;
        const size = source.get_all_palettes().default.length;
        if (size !== paletteSize) {
          await schematic.rebuildMesh();
          paletteSize = size;
        } else {
          await renderer.worldMeshBuilder.renderSchematicInstanced(schematic);
        }
        if (!disposed) afterRender();
      }
    } catch (error) {
      if (!disposed) { pause(); onError(error); }
    } finally {
      rendering = false;
    }
  }

  function pause() { clearInterval(timer); timer = undefined; }
  function tick() {
    try {
      world.tick(1);
      world.flush();
      onTick(++ticks);
      void refresh();
    } catch (error) { pause(); onError(error); }
  }

  function play() {
    if (timer === undefined) timer = setInterval(tick, 50 / speed);
  }
  return {
    play,
    pause,
    step: tick,
    setSpeed(value) {
      speed = value;
      if (timer !== undefined) { pause(); play(); }
    },
    async reset() {
      pause();
      while (rendering && !disposed) await new Promise(resolve => setTimeout(resolve, 10));
      if (disposed) return;
      circuit.forEach(({ x, y, z }, i) => {
        if (source.get_block_string(x, y, z) !== initial[i]) source.set_block_from_string(x, y, z, initial[i]);
      });
      const replacement = source.create_simulation_world();
      world.free();
      world = replacement;
      ticks = 0;
      onTick(0);
      await schematic.rebuildMesh();
      if (!disposed) afterRender();
    },
    toggle(x, y, z) {
      world.on_use_block(x, y, z);
      world.flush();
      void refresh();
    },
    dispose() { disposed = true; pause(); world.free(); },
  };
}

// schematic-renderer 1.6 drops properties from its instancing cache and then
// groups variants by name + properties. Restore them before instances are made.
export function configureBlockInstances(builder) {
  const prepare = builder.precomputePaletteGeometries.bind(builder);
  builder.precomputePaletteGeometries = async palette => {
    await prepare(palette);
    builder.paletteCache.blockData.forEach((entry, index) => {
      if (entry) entry.properties = palette[index].properties;
    });
  };
  const enable = builder.enableInstancedRendering.bind(builder);
  builder.enableInstancedRendering = group => {
    enable(group, true);
    // Keep one instance buffer per variant while assigning each merged face
    // its own pack material. The library otherwise uses the first material.
    for (const mesh of group.children) {
      if (!mesh.isInstancedMesh) continue;
      const parts = builder.paletteCache.blockData[mesh.userData.paletteIndex].materialGroups
        .filter(part => part.baseGeometry?.attributes.position?.count);
      if (parts.length < 2) continue;
      mesh.geometry.clearGroups();
      mesh.material = parts.map(part => part.material);
      let offset = 0;
      parts.forEach(({ baseGeometry }, index) => {
        const count = baseGeometry.index?.count ?? baseGeometry.attributes.position.count;
        mesh.geometry.addGroup(offset, count, index);
        offset += count;
      });
    }
  };
}

export function applyMaterialVisibility(schematic, hidden) {
  schematic.group.traverse(object => {
    // Overflow meshes use the block key in their name instead of userData.
    const key = object.userData.blockTypeKey ?? /^overflow_(.+)_\d+_part\d+$/.exec(object.name)?.[1];
    if (typeof key !== "string") return;
    const id = key.replace(/^minecraft:/, "").split("[")[0];
    object.visible = !hidden.has(id) && (!object.isInstancedMesh || object.count > 0);
  });
}

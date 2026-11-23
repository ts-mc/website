"""Apply fluid level variants without changing the pack's textures.

The renderer synthesizes block/<fluid>_level_N models with descending heights.
Levels 8–15 are falling fluid and must not use negative-height level models.
Run from the repository root after replacing the Minecraft resource pack.
"""
import json
from pathlib import Path
import zipfile

path = Path('public/minecraft-pack.zip')
replacement = path.with_suffix('.tmp.zip')
updates = {}
for fluid in ('water', 'lava'):
    variants = {
        f'level={level}': {
            'model': f'minecraft:block/{fluid}' + (f'_level_{level}' if 0 < level < 8 else '')
        }
        for level in range(16)
    }
    updates[f'assets/minecraft/blockstates/{fluid}.json'] = json.dumps({'variants': variants}, separators=(',', ':'))
# Cap the fast water flow strip at ten texture updates per second.
updates['assets/minecraft/textures/block/water_flow.png.mcmeta'] = json.dumps({'animation': {'frametime': 2}})
with zipfile.ZipFile(path) as source, zipfile.ZipFile(replacement, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as target:
    for entry in source.infolist():
        target.writestr(entry.filename, updates.pop(entry.filename, source.read(entry.filename)))
    for name, data in updates.items():
        target.writestr(name, data)
replacement.replace(path)

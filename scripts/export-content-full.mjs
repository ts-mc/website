#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const parentDir = path.dirname(projectRoot);
const projectName = path.basename(projectRoot);
const snapshotDir = path.join(parentDir, `${projectName}-rebuild-content`);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function sha256File(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buf).digest("hex");
  } catch {
    return null;
  }
}

async function main() {
  ensureDir(snapshotDir);
  console.log(`Snapshot dir: ${snapshotDir}`);
  
  // Collect routes
  const appDir = path.join(projectRoot, "src", "app");
  const routes = [];
  function walk(dir, basePath = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith("_")) continue;
      if (entry.name === "api") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, path.join(basePath, entry.name));
      } else if (entry.name === "page.tsx" || entry.name === "page.js") {
        let route = basePath.replace(/\\/g, "/");
        if (route === "") route = "/";
        routes.push(route);
      }
    }
  }
  if (fs.existsSync(appDir)) {
    walk(appDir);
  }
  routes.sort();
  
  // Try to load wiki articles
  let wikiArticles = [];
  try {
    // Use dynamic import with tsx via node loader isn't directly available, but maybe try requiring with ts-node/register style
    // Or just read the TS file and do a rough parse - better to just copy the file as-is for reference
    const wikiTsPath = path.join(projectRoot, "src", "data", "wiki", "articles.ts");
    if (fs.existsSync(wikiTsPath)) {
      wikiArticles = { sourceFile: wikiTsPath, content: fs.readFileSync(wikiTsPath, "utf-8") };
    }
  } catch (e) {
    console.error("err", e);
  }
  
  // Collect assets
  const assets = [];
  const publicDir = path.join(projectRoot, "public");
  function collectAssets(dir, rel="") {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const relPath = path.join(rel, entry.name).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        collectAssets(full, relPath);
      } else {
        const stat = fs.statSync(full);
        assets.push({
          path: relPath,
          bytes: stat.size,
          sha256: sha256File(full)
        });
      }
    }
  }
  collectAssets(publicDir);
  
  writeJson(path.join(snapshotDir, "routes.json"), { routes, timestamp: new Date().toISOString() });
  writeJson(path.join(snapshotDir, "wiki-articles.ts.json"), wikiArticles);
  writeJson(path.join(snapshotDir, "assets.json"), { assets, count: assets.length });
  
  // Also copy key files
  const keyFiles = [
    "src/data/wiki/articles.ts",
    "src/types/wiki.ts",
    "src/types/farm.ts",
    "src/app/globals.css",
    "tailwind.config.ts",
    "package.json",
  ];
  ensureDir(path.join(snapshotDir, "copied"));
  for (const kf of keyFiles) {
    const src = path.join(projectRoot, kf);
    if (fs.existsSync(src)) {
      const dest = path.join(snapshotDir, "copied", kf.replace(/\//g, "_"));
      fs.copyFileSync(src, dest);
    }
  }
  
  writeJson(path.join(snapshotDir, "source-manifest.json"), {
    projectRoot,
    projectName,
    timestamp: new Date().toISOString(),
    routesCount: routes.length,
    assetsCount: assets.length,
  });
  
  console.log("Full snapshot created");
}

main();

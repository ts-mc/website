#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

function collectRoutes() {
  const appDir = path.join(projectRoot, "src", "app");
  const routes = [];
  function walk(dir, basePath = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith("_")) continue;
      if (entry.name === "api") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Skip dynamic route params for now in a simple form
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
  return Array.from(new Set(routes)).sort();
}

function collectWikiArticles() {
  // Read from src/data/wiki/articles.ts by parsing with simple regex as it's TS
  const wikiPath = path.join(projectRoot, "src", "data", "wiki", "articles.ts");
  const articles = [];
  if (fs.existsSync(wikiPath)) {
    try {
      // Try to use ts-node/register or just read - but easier to do basic extraction
      const content = fs.readFileSync(wikiPath, "utf-8");
      // This is a rough extraction for the purpose of snapshot
      // Try to find article objects
      const articleMatches = content.match(/\{[\s\S]*?slug:\s*["']([^"']+)["'][\s\S]*?edition:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?\}/g);
      // Fallback: use node to load via tsx if available
    } catch (e) {
      console.error("wiki parse error", e.message);
    }
  }
  return articles;
}

function main() {
  ensureDir(snapshotDir);
  console.log(`Snapshot dir: ${snapshotDir}`);
  
  // Collect routes
  const routes = collectRoutes();
  writeJson(path.join(snapshotDir, "routes.json"), { routes, timestamp: new Date().toISOString() });
  
  // Collect wiki articles via node require? easier to just copy the source files and parse differently
  // Or use dynamic import
  writeJson(path.join(snapshotDir, "source-manifest.json"), {
    projectRoot,
    projectName,
    timestamp: new Date().toISOString(),
    routesCount: routes.length,
  });
  
  console.log("Basic snapshot created");
}

main();

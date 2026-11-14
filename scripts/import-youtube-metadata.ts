import fs from "node:fs/promises";
import path from "node:path";
import type { YoutubeMetadataSnapshot } from "../src/types/youtube";

async function main() {
const root = process.cwd();
const farmLines = (await fs.readFile(path.join(root, "farms.jsonl"), "utf8")).split(/\r?\n/);
const videos = new Map<string, string>();
for (const line of farmLines) {
  try {
    const record = JSON.parse(line) as { type?: string; video?: string };
    if (record.type !== "farm" || !record.video) continue;
    const id = record.video.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/i)?.[1];
    if (id) videos.set(id, record.video);
  } catch {
    // Skip malformed JSONL lines.
  }
}

const existingPath = path.join(root, "src/data/youtube-metadata.json");
let existing: Record<string, YoutubeMetadataSnapshot> = {};
try {
  existing = JSON.parse(await fs.readFile(existingPath, "utf8")) as Record<string, YoutubeMetadataSnapshot>;
} catch {
  // Start a new import if there is no previous snapshot file.
}

function htmlDecode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Extract one JSON object without relying on a brittle regex across strings. */
function extractJsonObject(html: string, expression: RegExp): unknown | undefined {
  const match = expression.exec(html);
  if (!match) return undefined;

  const start = html.indexOf("{", match.index + match[0].length);
  if (start === -1) return undefined;

  let depth = 0;
  let escaped = false;
  let quoted = false;
  for (let index = start; index < html.length; index++) {
    const character = html[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quoted = false;
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === "{") depth++;
    else if (character === "}" && --depth === 0) {
      try {
        return JSON.parse(html.slice(start, index + 1));
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

function parseMetadata(videoId: string, html: string): YoutubeMetadataSnapshot | undefined {
  const player = extractJsonObject(html, /(?:var\s+)?ytInitialPlayerResponse\s*=\s*/);
  const response = player as {
    videoDetails?: { title?: unknown; shortDescription?: unknown; viewCount?: unknown };
    microformat?: { playerMicroformatRenderer?: { publishDate?: unknown; uploadDate?: unknown } };
  } | undefined;
  const videoDetails = response?.videoDetails;
  const microformat = response?.microformat?.playerMicroformatRenderer;
  const fallbackDescription = html.match(/"shortDescription"\s*:\s*("(?:\\.|[^"\\])*")/)?.[1];
  const description = typeof videoDetails?.shortDescription === "string"
    ? videoDetails.shortDescription
    : fallbackDescription ? JSON.parse(fallbackDescription) as string : "";
  const fallbackTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)?.[1]
    || html.match(/<meta\s+name="title"\s+content="([^"]*)"/i)?.[1];
  const title = typeof videoDetails?.title === "string" ? videoDetails.title : fallbackTitle && htmlDecode(fallbackTitle);
  const rawViewCount = videoDetails?.viewCount;
  const viewCount = typeof rawViewCount === "string" && /^\d+$/.test(rawViewCount)
    ? Number(rawViewCount)
    : undefined;
  const publishedAt = typeof microformat?.publishDate === "string"
    ? microformat.publishDate
    : typeof microformat?.uploadDate === "string" ? microformat.uploadDate : undefined;

  if (!description.trim()) return undefined;
  return { videoId, title, description, viewCount, publishedAt, fetchedAt: new Date().toISOString() };
}

const results = new Map<string, YoutubeMetadataSnapshot>();
const failures: string[] = [];
const args = process.argv.slice(2);
const refresh = args.includes("--refresh");
const requestedIds = args.filter((arg) => arg !== "--refresh");
const pending = Array.from(videos.keys()).filter((id) =>
  (!requestedIds.length || requestedIds.includes(id))
    && (refresh || !existing[id]?.description || existing[id]?.viewCount === undefined)
);
const total = pending.length;
let completed = 0;
let saveQueue = Promise.resolve();

function saveProgress() {
  results.forEach((entry, id) => { existing[id] = entry; });
  const snapshot = `${JSON.stringify(existing, null, 2)}\n`;
  saveQueue = saveQueue.then(() => fs.writeFile(existingPath, snapshot));
  return saveQueue;
}

async function worker() {
  while (pending.length) {
    const videoId = pending.shift();
    if (!videoId) return;
    let imported: YoutubeMetadataSnapshot | undefined;
    for (let attempt = 0; attempt < 3 && !imported; attempt++) {
      try {
        const response = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en&gl=US`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
          },
          signal: AbortSignal.timeout(20000),
        });
        if (response.ok) imported = parseMetadata(videoId, await response.text());
      } catch {
        // Retry transient network errors and YouTube throttling.
      }
      if (!imported && attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
    }
    if (imported) results.set(videoId, imported);
    else failures.push(videoId);
    completed++;
    if (completed % 5 === 0 || completed === total) {
      console.log(`Imported ${completed}/${total} videos (${results.size} descriptions, ${failures.length} unavailable)`);
      await saveProgress();
    }
  }
}

await Promise.all(Array.from({ length: 2 }, () => worker()));
await saveProgress();
console.log(`Saved ${results.size} metadata snapshots (descriptions and view totals) to ${path.relative(root, existingPath)}; ${failures.length} videos could not be fetched.`);
if (failures.length) console.log(`Unavailable video IDs: ${failures.join(", ")}`);
}

void main();

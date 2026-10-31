import fs from "node:fs/promises";
import path from "node:path";

type VideoEntry = { videoId: string; title?: string; description: string };

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
let existing: Record<string, VideoEntry> = {};
try {
  existing = JSON.parse(await fs.readFile(existingPath, "utf8")) as Record<string, VideoEntry>;
} catch {
  // Start a new import if there is no previous snapshot file.
}

function parseMetadata(videoId: string, html: string): VideoEntry | undefined {
  const descriptionMatch = html.match(/"shortDescription"\s*:\s*("(?:\\.|[^"\\])*")/);
  const description = descriptionMatch?.[1] ? JSON.parse(descriptionMatch[1]) as string : "";
  const title = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)?.[1]
    || html.match(/<meta\s+name="title"\s+content="([^"]*)"/i)?.[1];
  if (!description.trim()) return undefined;
  return {
    videoId,
    title: title?.replace(/&amp;/g, "&").replace(/&quot;/g, '"'),
    description,
  };
}

const results = new Map<string, VideoEntry>();
const failures: string[] = [];
const pending = Array.from(videos.keys()).filter((id) => !existing[id]?.description);
let completed = 0;
async function worker() {
  while (pending.length) {
    const videoId = pending.shift();
    if (!videoId) return;
    let imported: VideoEntry | undefined;
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
    if (completed % 25 === 0 || completed === videos.size) {
      console.log(`Imported ${completed}/${videos.size} videos (${results.size} descriptions, ${failures.length} unavailable)`);
    }
  }
}

await Promise.all(Array.from({ length: 2 }, () => worker()));
results.forEach((entry, id) => { existing[id] = entry; });
await fs.writeFile(existingPath, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`Saved ${results.size} fetched descriptions to ${path.relative(root, existingPath)}; ${failures.length} videos could not be fetched.`);
if (failures.length) console.log(`Unavailable video IDs: ${failures.join(", ")}`);
}

void main();

import fs from "node:fs/promises";
import path from "node:path";
import type { YoutubeChannelVideoSnapshot } from "../src/types/youtube";

const CHANNELS = [
  ["TheySix", "UCC5uOtbEkDGgC29HRNu5Sxw"],
  ["TheySixMC", "UC1tc8BIvUJaTPUXsDxZDaPA"],
  ["TheySixCreations", "UC_JcrRDVxW8L6_Tw5mkj1Cg"],
  ["TheySixMinecraftJava", "UCB7a6G6iXv6K2-Bqnk4IBrQ"],
  ["TheySixBedrock", "UCydJhLrYqXqdXEBNbgFwqkg"],
] as const;

function decodeXml(value: string) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function tag(entry: string, name: string) {
  return entry.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "i"))?.[1]?.trim();
}

async function main() {
  const root = process.cwd();
  const destination = path.join(root, "src", "data", "youtube-channel-index.json");
  let existing: Record<string, YoutubeChannelVideoSnapshot> = {};
  try {
    existing = JSON.parse(await fs.readFile(destination, "utf8")) as Record<string, YoutubeChannelVideoSnapshot>;
  } catch {
    // The file is initialized after the first successful channel fetch.
  }

  for (const [channel, channelId] of CHANNELS) {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      headers: { "User-Agent": "TheySix archive metadata refresher" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.warn(`Skipped ${channel}: YouTube returned ${response.status}.`);
      continue;
    }
    const xml = await response.text();
    for (const entry of xml.match(/<entry>[\s\S]*?<\/entry>/gi) || []) {
      const videoId = tag(entry, "yt:videoId");
      const title = tag(entry, "title");
      const publishedAt = tag(entry, "published");
      if (!videoId || !title || !publishedAt) continue;
      existing[videoId] = { videoId, channel, title: decodeXml(title), publishedAt };
    }
    console.log(`Indexed the latest ${channel} uploads.`);
  }

  await fs.writeFile(destination, `${JSON.stringify(existing, null, 2)}\n`);
  console.log(`Saved ${Object.keys(existing).length} YouTube channel records.`);
}

void main();

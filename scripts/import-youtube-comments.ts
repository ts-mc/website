import fs from "node:fs/promises";
import path from "node:path";
import youtubeMetadata from "../src/data/youtube-metadata.json";

type Candidate = {
  videoId: string;
  commentId: string;
  author: string;
  text: string;
  publishedAt?: string;
  likeCount?: number;
};

type YoutubeCommentThread = {
  id?: string;
  snippet?: {
    topLevelComment?: {
      id?: string;
      snippet?: {
        authorDisplayName?: string;
        textDisplay?: string;
        publishedAt?: string;
        likeCount?: number;
      };
    };
  };
};

/**
 * Download public comment candidates for staff review. This never publishes a
 * comment: copy only useful, accurate fixes into communityNotes in the matching public/farms/<DN>.json.
 *
 * Requires a server-side YOUTUBE_API_KEY with YouTube Data API v3 enabled.
 * Usage: YOUTUBE_API_KEY=... npm run import:youtube-comments -- VIDEO_ID
 */
async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is required; no comments were fetched.");

  const requestedIds = process.argv.slice(2).filter((value) => !value.startsWith("-"));
  const allVideoIds = Object.keys(youtubeMetadata);
  const videoIds = requestedIds.length ? requestedIds : allVideoIds;
  const root = process.cwd();
  const destination = path.join(root, "src", "data", "youtube-comment-candidates.json");
  const existing = JSON.parse(await fs.readFile(destination, "utf8")) as Candidate[];
  const candidates = new Map(existing.map((candidate) => [candidate.commentId, candidate]));

  for (const videoId of videoIds) {
    const params = new URLSearchParams({
      key: apiKey,
      part: "snippet",
      videoId,
      maxResults: "100",
      order: "relevance",
      textFormat: "plainText",
    });
    const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?${params}`, {
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.warn(`Skipped ${videoId}: YouTube returned ${response.status}.`);
      continue;
    }
    const body = await response.json() as { items?: YoutubeCommentThread[] };
    for (const thread of body.items || []) {
      const comment = thread.snippet?.topLevelComment;
      const snippet = comment?.snippet;
      if (!snippet || !comment?.id || !snippet.textDisplay?.trim()) continue;
      candidates.set(comment.id, {
        videoId,
        commentId: comment.id,
        author: snippet.authorDisplayName || "YouTube viewer",
        text: snippet.textDisplay.trim(),
        publishedAt: snippet.publishedAt,
        likeCount: snippet.likeCount,
      });
    }
    console.log(`Fetched comment candidates for ${videoId}.`);
  }

  const output = Array.from(candidates.values()).sort((a, b) => b.videoId.localeCompare(a.videoId));
  await fs.writeFile(destination, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Saved ${output.length} private review candidates. None are visible on the website until staff approve them.`);
}

void main();

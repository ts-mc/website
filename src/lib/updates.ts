import fs from "node:fs";
import path from "node:path";

export type UpdateBodyBlock =
  | { type: "heading"; level?: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] };

export type UpdateRecord = {
  date: string;
  type?: string;
  title: string;
  summary: string;
  description?: string;
  body?: UpdateBodyBlock[];
  href?: string;
};

function readServerNews(): UpdateRecord[] {
  const source = path.join(process.cwd(), "public", "news", "server-news.jsonl");
  if (!fs.existsSync(source)) return [];
  const content = fs.readFileSync(source, "utf8").trim();
  return content.split(/\r?\n/).flatMap((line) => {
    try {
      return [JSON.parse(line) as UpdateRecord];
    } catch {
      return [];
    }
  });
}

function readUpdates(folder: "logs" | "news"): UpdateRecord[] {
  const directory = path.join(process.cwd(), "public", folder);
  if (!fs.existsSync(directory)) return [];
  const files = fs.readdirSync(directory).filter((file) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(file)).sort().reverse();
  return files.flatMap((file) => {
    const content = fs.readFileSync(path.join(directory, file), "utf-8").trim();
    const records = content.split(/\r?\n\s*\r?\n/).flatMap((block) => {
      try {
        return [JSON.parse(block) as UpdateRecord];
      } catch {
        return block.split(/\r?\n/).flatMap((line) => {
          try {
            return [JSON.parse(line) as UpdateRecord];
          } catch {
            return [];
          }
        });
      }
    });

    return records.flatMap((record) => record.title && record.summary && record.date ? [record] : []);
  });
}

export function getLogs() {
  return readUpdates("logs").sort((a, b) => b.date.localeCompare(a.date));
}

export function getLogsForDate(date: string) {
  return getLogs().filter((entry) => entry.date === date);
}

export function getNews() {
  return [...readUpdates("news"), ...readServerNews()].sort((a, b) => b.date.localeCompare(a.date));
}

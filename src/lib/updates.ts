import fs from "node:fs";
import path from "node:path";

export type UpdateRecord = {
  date: string;
  type?: string;
  title: string;
  summary: string;
  href?: string;
};

function shorten(text: string, maximum: number) {
  if (text.length <= maximum) return text;
  const shortened = text.slice(0, maximum + 1).replace(/\s+\S*$/, "").trim();
  return `${shortened}…`;
}

function readServerNews(): UpdateRecord[] {
  const source = path.join(process.cwd(), "public", "news", "server-news.jsonl");
  if (!fs.existsSync(source)) return [];

  const content = fs.readFileSync(source, "utf-8");
  const headers = Array.from(content.matchAll(/^.* — (\d{1,2})\/(\d{1,2})\/(\d{2}), [^\n]+$/gm));

  return headers.flatMap((header, index) => {
    const nextHeader = headers[index + 1];
    const messageStart = (header.index ?? 0) + header[0].length;
    const message = content.slice(messageStart, nextHeader?.index).trim();
    const text = message
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !/^@(here|everyone)$/.test(line) && !/^(Image|Image failed to load\.|\d+ Messages ›)$/.test(line))
      .join(" ");
    if (!text) return [];

    const [, month, day, year] = header;
    const date = `20${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const href = message.match(/https?:\/\/[^\s]+/)?.[0];

    return [{
      date,
      title: shorten(text.replace(/https?:\/\/[^\s]+/g, "").trim(), 88),
      summary: shorten(text, 240),
      href,
    }];
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

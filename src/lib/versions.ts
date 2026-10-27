import fs from "node:fs";
import path from "node:path";

export type VersionChange = {
  type: string;
  text: string;
};

export type VersionRecord = {
  /** Semver-style version, e.g. "1.0.0" */
  version: string;
  /** Release date, YYYY-MM-DD */
  date: string;
  title: string;
  summary?: string;
  changes: VersionChange[];
};

export type VersionFile = {
  version: string;
};

/**
 * Version files live in /public/versions/<xx-yy-zz>.json (viewable on the site)
 * and /public/versions/<xx-yy-zz>.readme (markdown for GitHub).
 * The file name dashes map to version dots: 1-2-3 -> 1.2.3.
 */
const VERSIONS_DIR = path.join(process.cwd(), "public", "versions");

function versionFromFilename(filename: string) {
  const match = /^(\d{1,3}(?:-\d{1,3})*)\.(json|readme)$/.exec(filename);
  return match ? match[1].split("-").join(".") : null;
}

function listVersionFiles(extension: "json" | "readme") {
  if (!fs.existsSync(VERSIONS_DIR)) return [];
  return fs
    .readdirSync(VERSIONS_DIR)
    .filter((file) => file.endsWith(`.${extension}`))
    .map(versionFromFilename)
    .filter((version): version is string => version !== null);
}

export function getAllVersions(): VersionFile[] {
  return listVersionFiles("json")
    .map((version) => ({ version }))
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
}

export function getVersion(version: string): VersionRecord | null {
  if (!/^\d{1,3}(?:\.\d{1,3})*$/.test(version)) return null;
  const file = path.join(VERSIONS_DIR, `${version.split(".").join("-")}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const record = JSON.parse(fs.readFileSync(file, "utf-8")) as VersionRecord;
    record.version = version;
    return record;
  } catch {
    return null;
  }
}

/** Raw markdown of the .readme file, for GitHub / raw viewing. */
export function getVersionReadme(version: string): string | null {
  if (!/^\d{1,3}(?:\.\d{1,3})*$/.test(version)) return null;
  const file = path.join(VERSIONS_DIR, `${version.split(".").join("-")}.readme`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8");
}

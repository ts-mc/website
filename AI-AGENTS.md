# Working on the farm archive

Read [AGENTS.md](AGENTS.md) for repository-wide conventions. Use [ARCHITECTURE.md](ARCHITECTURE.md) to locate the catalog, detail route and download handlers.

## Adding a JSONL farm

Check the exact DN and video for duplicates, including the Bedrock prefix. Follow the neighboring record format, preserve supplied URLs and use JSON null for a missing schematic. Keep one complete JSON object per line. Confirm the video belongs to the requested design before publishing a release-dependent entry.

Parse the edited JSONL and verify exactly one matching DN. For loader or UI changes, run the relevant checks from `package.json` (typecheck, lint, build) and inspect a Java record and a Bedrock record on the affected route.

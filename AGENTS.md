# Repository guide

## What this project is

TheySix is a Next.js 14 website for a Minecraft community and its farm archive. It serves Java, Bedrock, and build entries, farm detail pages, downloadable worlds and schematics, interactive schematic previews, news, logs, a wiki, and community pages.

## Project layout

- `src/app/` — Next.js App Router routes, layouts, and API handlers.
- `src/components/` — shared UI, including farm cards, farm detail views, filters, and schematic viewers.
- `public/farms/` — one JSON record per DN, such as `533.json` or `B172.json`.
- `src/data/schematics/` and `src/data/worlds/` — local schematic and world assets.
- `src/data/materials/` — material data used by farm pages and schematic previews.
- `src/data/wiki/` — wiki content.
- `src/lib/` — data loading, normalization, and shared application logic.
- `src/types/` — shared TypeScript types.
- `public/` — static images, icons, and other browser assets.

## Working conventions

- Follow the existing Next.js App Router and TypeScript patterns. Keep client-only interactions in components marked with `"use client"` and leave data fetching in server routes where practical.
- Farm data is described by `FarmData` in `src/types/farm.ts`; use `getAllFarms()` from `src/lib/farms.ts` when a route needs the normalized farm catalog.
- Keep farm download URLs sourced from farm data. Farm category labels are Java, Bedrock, or Build; avoid inferring the category from display text when the `category` field is available.
- Use the existing global styles and Tailwind utility conventions. Keep layouts responsive and consistent with the dark TheySix visual theme.
- Preserve unrelated working-tree changes. Avoid changing generated, binary, or user-provided assets unless the task requires it.

## Common commands

- `npm run dev` — local development server.
- `npm run lint` — ESLint checks.
- `npm run typecheck` — TypeScript check.
- `npm run build` — production build.

Run checks when requested or when needed to verify a change; do not add tests unless asked.

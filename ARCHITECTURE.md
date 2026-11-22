# Farm archive architecture

The site uses Next.js 14 App Router, React 18, TypeScript and Tailwind 3. Routes live in `src/app` and shared views in `src/components`.

## From record to download

1. Catalog inputs include [farms.jsonl](farms.jsonl) and farm modules under `src/data/farms`. The shared catalog interface is `getAllFarms()` in [farms.ts](src/lib/farms.ts).
2. The DN route selects a record for the detail view. Shared types in `src/types/farm.ts` describe farm data. Video enrichment lives alongside the catalog in `src/data/youtube-*.json`.
3. World and schematic actions use the record and available assets. The handlers under `src/app/api` cover local worlds, local schematics, material lists and the schematic proxy.

For an incorrect link, compare the source record with the normalized farm before changing a viewer or component.

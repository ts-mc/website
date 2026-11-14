# THEYSIX Farm Archive — Remake

An independent Next.js remake of the THEYSIX Minecraft farm archive. It is a focused visual and interaction prototype for a practical farm-discovery experience, rather than a complete replacement for the production archive.

The current homepage includes:

- Signal Field visual direction: onyx surfaces, turquoise accents, restrained olive metadata, heavy type, and hairline rules.
- A cinematic archive entry point with keyboard-accessible skip navigation.
- Client-side search and Java, Bedrock, and Build filters.
- A fixed, bottom-centred navigation dock and persistent footer.
- Clear unavailable states: the sample records do not imply downloads, rates, credits, or source material that has not been supplied.

## Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- CSS in `src/app/globals.css`
- Lucide React, available for icons as the prototype grows

## Run locally

From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

```bash
npm run dev       # start the development server
npm run lint      # run ESLint
npm run typecheck # run TypeScript without emitting files
npm run build     # create a production build
npm run start     # serve a production build
```

## Project structure

```text
src/app/
├── layout.tsx    # document shell, dock, footer, and metadata
├── page.tsx      # archive-led homepage
├── ui.tsx        # interactive dock and farm explorer
└── globals.css   # responsive Signal Field design system
```

## Content status

`FarmExplorer` currently uses a compact set of representative records in `src/app/ui.tsx`. Before treating this as a production catalogue, replace those records with normalized, sourced farm data and expose only verified tutorials, worlds, schematics, availability, authorship, and rates.

Keep the navigation order as **Wiki, Events, About, Main, Socials, Legal, Audio**. On the default page, Main occupies the elevated centre position; selecting another destination swaps it into that position.

## Contribution notes

Follow [`AGENTS.md`](AGENTS.md) for the product and accessibility constraints. In particular, preserve minimum 44px interactive targets, visible keyboard focus, reduced-motion support, and the fixed navigation/footer behavior. Keep this app self-contained—do not import sibling-repository files at runtime.

Minecraft is a trademark of Mojang Studios. This project is not affiliated with Mojang Studios or Microsoft.

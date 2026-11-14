# AI implementation notes — THEYSIX farm archive

This folder is an independent Next.js/React/TypeScript remake of the THEYSIX Minecraft farm site.

## Preserve

- Keep the Signal Field visual language: onyx background, vanilla text, muted olive metadata, turquoise accent, tight heavy headings, tracked uppercase labels, hairline rules, and generous vertical spacing.
- Keep the fixed bottom-centered navigation in this exact order: Wiki, Events, About, Main, Socials, Legal, Audio.
- Main is the elevated center slot on the default page. The selected category may swap with Main into the center slot.
- Keep the persistent footer with Explore, Community, and Legal groups.
- Never invent download availability, farm rates, credits, checksums, or source facts.
- Preserve accessible labels, keyboard focus, skip navigation, 44px minimum interactive targets, and reduced-motion behavior.

## Site role

This site is the practical Minecraft farm archive. Prioritize farm discovery, Java/Bedrock/build filtering, search, edition labels, resource availability, tutorials, worlds, schematics, and honest unavailable states.

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Do not import files from sibling repositories at runtime. If real content is added, normalize it into this app or a local snapshot first.

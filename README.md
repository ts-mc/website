# TheySix Minecraft Farms Website 🎮

A modern, lightning-fast Next.js 14 website for **TheySix** to share Minecraft Java & Bedrock farm blueprints, interactive 3D schematics, world downloads, and video tutorials.

---

## 🚀 Key Features

- **🧊 3D Interactive Schematic Viewer (schemat.io style)**:
  - High-performance canvas-rendered 3D voxel engine with orbital camera rotation, pitch, pan, and zoom.
  - **Layer-by-Layer Slicing**: Slider control from Y=0 to Y=Max with "Range (1..Y)", "Single Layer", and "All Layers" modes, plus automated **Build Animation** playback.
  - **Material List (BOM)**: Searchable block count breakdown with Minecraft stack conversions (e.g. `5 stacks + 12 items`) and one-click copy to clipboard.
  - **Multi-Format Support**: Displays and downloads `.litematic`, `.schematic`, `.schem`, and `.nbt` (e.g. `111-dn.litematic`, `111-dn.schematic`, `111-dn.schem`, `111-dn.nbt`).
  - Direct download actions without link copying.
- **✨ Java & Bedrock Edition Theme & Icons**:
  - **Java Edition**: Highlighted in `#9fff99` (vibrant green) with Coffee cup icon.
  - **Bedrock Edition**: Highlighted in `#ffffff` / light grey with Bedrock Block / Cube icon.
- **🎨 Item Icons in Material List**:
  - Automatically loads `<item>.png` (or `.webp`/`.svg`) from `/public/items/` for any material in the farm's material list.
  - Supports automatic snake_case, kebab-case, singular/plural names, and fallback block color indicators.
- **👁️ View Counts**: Automatic and custom view counter displayed on the bottom-left of each farm card.
- **⚡ Auto Platform & Slug Detection**:
  - Files without `b` prefix (e.g. `111-dn.tsx`) are automatically classified as **Java Edition**.
  - Files starting with `b` (e.g. `b111-dn.tsx`) are automatically classified as **Bedrock Edition** (schematics disabled automatically).
- **🏰 Minecraft Server SMP Hub (`/server`, `/server/about`)**:
  - Community events and tournaments managed by **ro_mihaiu** at **[discord.ro-mihaiu.xyz](https://discord.ro-mihaiu.xyz)**.
  - Sub-pages for `/server/rules`, `/server/events`, and `/server/staff`.
- **📱 Socials & Channels (`/socials`)**:
  - Links to YouTube Java (`@TheySix`), YouTube Bedrock (`@TheySixMC`), and YouTube Minecraft Builds (`@TheySixCreations`).

---

## 📁 File & Folder Structure

The archive reads one JSON record per DN from [public/farms](public/farms). Detail pages use `/dn/<dn>`.

---

## 🎨 How to Add Item Icons for Material Lists

Drop any item icon (`.png`, `.webp`, or `.svg`) directly into `public/items/`:

```
public/items/
├── smooth_stone.png
├── hopper.png
├── chest.png
├── water_bucket.png
├── piston.png
└── sticky_piston.png
```

The system will automatically find and display the matching icon for items in the farm checklist!

---

## Adding a farm

Copy an existing record such as [533.json](public/farms/533.json) to `public/farms/<DN>.json` and update its DN, ID, category, and content. Use an uppercase prefix for Bedrock and build filenames. The site discovers JSON files automatically.

Use `description` for the summary and `detailedDescription` for the About section. Set `youtubeUrl` and `worldDownloadUrl` to the available links. List every schematic download in `schematicUrls`. The first link is the default for the preview. Store staff-approved viewer tips in `communityNotes` using the `ApprovedYoutubeComment` shape and checklist items in `materials` with a name and count. Empty lists are supported.

---

## 🏆 How to Add / Manage Server Events

Server events are managed by **ro_mihaiu** and defined in `src/app/server/events/page.tsx`.

To add a new event, open `src/app/server/events/page.tsx` and add an entry to the `upcomingEvents` array:

```tsx
{
  title: "Autumn Redstone Engineering Contest",
  category: "Technical / Redstone",
  icon: Trophy, // from lucide-react
  color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
  date: "October 10, 2026 - 18:00 UTC",
  duration: "5 Days",
  prize: "75k In-Game Coins + Discord Role",
  description: "Design the most efficient compact item sorting system. Judged on speed, hopper lock efficiency, and overflow protection.",
  status: "Upcoming",
  statusColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
}
```

Players can register for any event directly via the Events Discord: **[https://discord.ro-mihaiu.xyz](https://discord.ro-mihaiu.xyz)**.

---

## 🏃 Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```


# ts-website

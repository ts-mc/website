/**
 * Generates the static raster assets the site needs but cannot produce at
 * runtime: the Open Graph card, the Apple touch icon and the favicon set.
 *
 * Run with: node scripts/generate-assets.mjs
 *
 * Everything is composed from SVG so the output is deterministic and needs no
 * image service. The GIF logo is only ever used as a still frame here — social
 * crawlers do not render animated GIFs, so logo.gif must never be the OG image.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = join(here, "..");
const publicDir = join(root, "public");

const BRAND = "#4CADD0";
const BRAND_MID = "#9FEBF6";
const BRAND_HI = "#B2F9FF";
const BG_DEEP = "#070A12";
const BG_ELEV = "#111726";
const TEXT = "#F1F5F9";
const TEXT_MUTED = "#94A3B8";

function render(svg, outputPath, width, height) {
  const tmp = mkdtempSync(join(tmpdir(), "ts-assets-"));
  const svgPath = join(tmp, "art.svg");
  const fontsConf = join(tmp, "fonts.conf");

  writeFileSync(svgPath, svg);
  // rsvg-convert resolves families through fontconfig, so point it at the
  // repo-local font directory instead of the host's installed fonts.
  writeFileSync(
    fontsConf,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${FONT_DIR}</dir>
  <cachedir>${tmp}</cachedir>
</fontconfig>
`,
  );

  execFileSync("rsvg-convert", [
    "--stylesheet",
    fontsConf,
    "-w",
    String(width),
    "-h",
    String(height),
    "-o",
    outputPath,
    svgPath,
  ]);

  rmSync(tmp, { recursive: true, force: true });
}

/**
 * The brand's signature gradient, expressed as an SVG linearGradient so the
 * raster output matches the site's CSS.
 */
function gradientDefs(id, angleDeg = 100) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const dx = Math.cos(rad) / 2;
  const dy = Math.sin(rad) / 2;

  return `
    <defs>
      <linearGradient id="${id}" x1="${0.5 - dx}" y1="${0.5 - dy}" x2="${0.5 + dx}" y2="${0.5 + dy}">
        <stop offset="0%" stop-color="${BRAND}"/>
        <stop offset="45%" stop-color="${BRAND_MID}"/>
        <stop offset="100%" stop-color="${BRAND_HI}"/>
      </linearGradient>
      <radialGradient id="orb-brand" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${BRAND}" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="orb-violet" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#A855F7" stop-opacity="0.26"/>
        <stop offset="100%" stop-color="#A855F7" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
}

/**
 * Inlines the brand fonts into the SVG so rsvg-convert renders the real
 * typefaces instead of whatever the build machine happens to have installed.
 */
const FONT_DIR = join(here, "assets", "fonts");

const FONT_FILES = {
  "InterDisplay": {
    file: "InterDisplay-ExtraBold.ttf",
    family: "InterDisplay Asset",
    weight: 800,
  },
  "Inter": { file: "Inter-SemiBold.ttf", family: "Inter Asset", weight: 600 },
  "InterMedium": {
    file: "Inter-Medium.ttf",
    family: "Inter Medium Asset",
    weight: 500,
  },
  "JetBrainsMono": {
    file: "JetBrainsMono-Bold.ttf",
    family: "JetBrains Mono Asset",
    weight: 700,
  },
};

function fontFaceDefs() {
  return Object.entries(FONT_FILES)
    .map(
      ([, entry]) => `
    @font-face {
      font-family: "${entry.family}";
      src: url(data:font/ttf;base64,${readFileSync(join(FONT_DIR, entry.file)).toString("base64")});
      font-weight: ${entry.weight};
      font-style: normal;
    }`,
    )
    .join("");
}

const INTER_DISPLAY = FONT_FILES.InterDisplay.family;
const INTER = FONT_FILES.Inter.family;
const INTER_MEDIUM = FONT_FILES.InterMedium.family;
const MONO = FONT_FILES.JetBrainsMono.family;

/**
 * A single still frame of the animated logo, inlined so the SVG is
 * self-contained for rsvg-convert.
 */
function logoDataUri(framePath) {
  const base64 = readFileSync(framePath).toString("base64");
  return `data:image/png;base64,${base64}`;
}

function ogSvg(logoUri) {
  const width = 1200;
  const height = 630;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style type="text/css"><![CDATA[${fontFaceDefs()}]]></style>
  ${gradientDefs("brand-gradient")}
  <rect width="${width}" height="${height}" fill="${BG_DEEP}"/>
  <rect width="${width}" height="${height}" fill="url(#orb-brand)" transform="translate(-140,-260)"/>
  <rect width="${width}" height="${height}" fill="url(#orb-violet)" transform="translate(700,120)"/>

  <!-- Logo tile -->
  <rect x="72" y="64" width="104" height="104" rx="26" fill="${BG_ELEV}" stroke="#1E293B" stroke-width="2"/>
  <clipPath id="logo-clip"><rect x="72" y="64" width="104" height="104" rx="26"/></clipPath>
  <image href="${logoUri}" x="72" y="64" width="104" height="104" preserveAspectRatio="xMidYMid slice" clip-path="url(#logo-clip)"/>

  <!-- Wordmark lockup -->
  <text x="200" y="122" font-family="${INTER_DISPLAY}" font-size="42" font-weight="800" letter-spacing="-1.2" fill="${TEXT}">TheySix</text>
  <rect x="344" y="92" width="112" height="40" rx="20" fill="#0E3A47"/>
  <text x="400" y="119" font-family="${MONO}" font-size="19" font-weight="700" letter-spacing="1.5" fill="${BRAND_HI}" text-anchor="middle">FARMS</text>

  <!-- Headline -->
  <text x="72" y="300" font-family="${INTER_DISPLAY}" font-size="88" font-weight="800" letter-spacing="-3" fill="url(#brand-gradient)">500+ FARM</text>
  <text x="72" y="392" font-family="${INTER_DISPLAY}" font-size="88" font-weight="800" letter-spacing="-3" fill="${TEXT}">SCHEMATICS.</text>

  <!-- Subline -->
  <text x="72" y="470" font-family="${INTER_MEDIUM}" font-size="34" font-weight="500" fill="${TEXT_MUTED}">Java &amp; Bedrock · .litematic downloads · video tutorials</text>

  <!-- Address bar -->
  <rect x="72" y="510" width="360" height="76" rx="20" fill="#111726" fill-opacity="0.9" stroke="${BRAND}" stroke-opacity="0.45" stroke-width="2"/>
  <text x="104" y="544" font-family="${MONO}" font-size="15" font-weight="700" letter-spacing="2.2" fill="${TEXT_MUTED}">BROWSE THE VAULT</text>
  <text x="104" y="572" font-family="${MONO}" font-size="24" font-weight="700" fill="${BRAND_HI}">theysix.ro-mihaiu.xyz</text>

  <!-- Domain -->
  <text x="${width - 72}" y="572" font-family="${MONO}" font-size="20" font-weight="700" letter-spacing="1.4" fill="${TEXT_MUTED}" text-anchor="end">theysix.ro-mihaiu.xyz</text>

  <!-- Corner rule -->
  <rect x="0" y="${height - 8}" width="${width}" height="8" fill="url(#brand-gradient)"/>
</svg>`;
}

function iconSvg(logoUri, size) {
  const radius = Math.round(size * 0.22);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <style type="text/css"><![CDATA[${fontFaceDefs()}]]></style>
  ${gradientDefs("brand-gradient")}
  <defs>
    <clipPath id="icon-clip"><rect width="${size}" height="${size}" rx="${radius}"/></clipPath>
  </defs>
  <rect width="${size}" height="${size}" fill="${BG_DEEP}"/>
  <image href="${logoUri}" x="0" y="0" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice" clip-path="url(#icon-clip)"/>
  <rect width="${size}" height="${size}" rx="${radius}" fill="none" stroke="${BRAND}" stroke-opacity="0.35" stroke-width="${Math.max(2, Math.round(size * 0.012))}"/>
</svg>`;
}

/** A monochrome maskable icon: the letter T on the dark canvas, no photo. */
function maskableSvg(size) {
  const pad = Math.round(size * 0.24);
  const glyph = size - pad * 2;
  const barHeight = Math.round(glyph * 0.17);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <style type="text/css"><![CDATA[${fontFaceDefs()}]]></style>
  ${gradientDefs("brand-gradient")}
  <rect width="${size}" height="${size}" fill="${BG_DEEP}"/>
  <rect x="${pad}" y="${pad + Math.round(glyph * 0.06)}" width="${glyph}" height="${barHeight}" rx="${Math.round(barHeight / 2)}" fill="url(#brand-gradient)"/>
  <rect x="${Math.round(size / 2 - barHeight / 2)}" y="${pad + Math.round(glyph * 0.06)}" width="${barHeight}" height="${glyph * 0.88}" rx="${Math.round(barHeight / 2)}" fill="url(#brand-gradient)"/>
</svg>`;
}

function main() {
  // A still frame of the animated logo, used only for the static raster assets.
  const framePath = join(tmpdir(), "ts-assets-frame.png");
  execFileSync("magick", [
    `${join(publicDir, "logo.gif")}[0]`,
    "-coalesce",
    "-resize",
    "528x528",
    framePath,
  ]);
  const logoUri = logoDataUri(framePath);

  const outputs = [
    { svg: ogSvg(logoUri), path: join(publicDir, "og-image.png"), w: 1200, h: 630 },
    { svg: iconSvg(logoUri, 512), path: join(publicDir, "apple-touch-icon.png"), w: 512, h: 512 },
    { svg: iconSvg(logoUri, 192), path: join(publicDir, "icon-192.png"), w: 192, h: 192 },
    { svg: iconSvg(logoUri, 512), path: join(publicDir, "icon-512.png"), w: 512, h: 512 },
    { svg: maskableSvg(512), path: join(publicDir, "maskable-icon-512.png"), w: 512, h: 512 },
  ];

  for (const output of outputs) {
    render(output.svg, output.path, output.w, output.h);
    console.log(`wrote ${output.path.replace(`${root}/`, "")}`);
  }

  // Multi-size .ico, assembled from the already-rendered PNGs.
  const icoPath = join(publicDir, "favicon.ico");
  execFileSync("magick", [
    join(publicDir, "icon-192.png"),
    "-resize",
    "32x32",
    join(publicDir, "favicon-32.png"),
  ]);
  execFileSync("magick", [
    join(publicDir, "icon-192.png"),
    "-resize",
    "16x16",
    join(publicDir, "favicon-16.png"),
  ]);
  execFileSync("magick", [
    join(publicDir, "favicon-32.png"),
    join(publicDir, "favicon-16.png"),
    icoPath,
  ]);
  rmSync(join(publicDir, "favicon-32.png"), { force: true });
  rmSync(join(publicDir, "favicon-16.png"), { force: true });
  rmSync(framePath, { force: true });

  console.log(`wrote ${icoPath.replace(`${root}/`, "")}`);
}

main();

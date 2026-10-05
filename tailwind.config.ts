import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Token aliases — the events design system. */
        bg: "var(--bg)",
        "bg-base": "var(--bg-base)",
        "bg-elev": "var(--bg-elev)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        hairline: "var(--border)",
        "hairline-hover": "var(--border-hover)",
        ink: "var(--text)",
        "ink-muted": "var(--text-muted)",
        "ink-dim": "var(--text-dim)",
        brand: "var(--brand)",
        "brand-hi": "var(--brand-hi)",
        "brand-2": "var(--brand-2)",
        lime: "var(--lime)",
        emerald: "var(--emerald)",
        amber: "var(--amber)",
        orange: "var(--orange)",
        rose: "var(--rose)",
        crimson: "var(--crimson)",
        magenta: "var(--magenta)",
        violet: "var(--violet)",
        indigo: "var(--indigo)",
        sky: "var(--sky)",
        teal: "var(--teal)",
        blurple: "var(--blurple)",
        "blurple-text": "var(--blurple-text)",
        "indigo-text": "var(--indigo-text)",
        /* Legacy farms mappings, kept working and aliased to the new tokens. */
        background: "var(--bg-base)",
        "surface-50": "var(--bg-elev)",
        "surface-100": "#181d2a",
        "surface-200": "#131722",
        "surface-300": "#0f131c",
        mc: {
          green: "#2ecc71",
          emerald: "var(--emerald)",
          bedrock: "var(--text)",
          java: "var(--lime)",
          cyan: "var(--brand)",
          blue: "#3b82f6",
          purple: "var(--violet)",
          gold: "var(--amber)",
          dark: "var(--bg-base)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        panel: "28px",
        card: "20px",
        control: "12px",
        pill: "9999px",
      },
      fontSize: {
        mono: ["0.6875rem", { lineHeight: "1rem" }],
      },
      maxWidth: {
        shell: "1200px",
      },
      transitionTimingFunction: {
        reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

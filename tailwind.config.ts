import type { Config } from "tailwindcss";

// All theme-sensitive colors are CSS variables on <body>. Tailwind references
// them via `colors.theme.*` so utility classes like `bg-theme-bg` and
// `text-theme-fg-muted` work everywhere without re-listing palettes here.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--bg)",
          fg: "var(--fg)",
          "fg-muted": "var(--fg-muted)",
          "fg-dim": "var(--fg-dim)",
          surface: "var(--surface)",
          "surface-strong": "var(--surface-strong)",
          border: "var(--border)",
          "border-strong": "var(--border-strong)",
          hover: "var(--hover)",
          accent: "var(--accent)",
          "accent-soft": "var(--accent-soft)",
          "accent-fg": "var(--accent-fg)",
          selectionBg: "var(--selection-bg)",
          selectionFg: "var(--selection-fg)",
          c0: "var(--c0)",
          c1: "var(--c1)",
          c2: "var(--c2)",
          c3: "var(--c3)",
          c4: "var(--c4)",
          c5: "var(--c5)",
          c6: "var(--c6)",
          c7: "var(--c7)",
          c8: "var(--c8)",
          c9: "var(--c9)",
          c10: "var(--c10)",
          c11: "var(--c11)",
          c12: "var(--c12)",
          c13: "var(--c13)",
          c14: "var(--c14)",
          c15: "var(--c15)",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SF Mono",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        blink: {
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1.1s steps(2, start) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

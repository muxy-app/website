"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { THEMES, FEATURED_COUNT } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

const STORAGE_KEY = "muxy.website.theme";
// Pre-hydration script in layout.tsx reads this key and writes the variables
// to <body> before React mounts, eliminating the default-theme flash.
const VARS_STORAGE_KEY = "muxy.website.themeVars";
const DEFAULT_NAME = "Muxy";

type ThemeContextValue = {
  themes: Theme[];
  featuredCount: number;
  active: Theme;
  // False on first render (matches SSR); flips true after we've read the
  // saved theme out of localStorage. Consumers that render the theme name
  // (e.g. the picker button) should suppress their label until hydrated.
  hydrated: boolean;
  setActiveName: (name: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used inside <ThemeProvider>");
  return ctx;
}

function hexToRgba(hex: string, a: number) {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function luminance(hex: string) {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

// Pick a sensible accent: prefer cursor color, fall back to palette[4]/[5] if
// cursor matches the foreground (some themes set them equal).
function resolveAccent(t: Theme) {
  const cursorIsFg = t.cursor.toLowerCase() === t.foreground.toLowerCase();
  if (!cursorIsFg) return t.cursor;
  return t.palette[4] || t.palette[5] || t.foreground;
}

// Compute every CSS variable for a theme as a plain map. Splitting compute
// from apply lets us persist the map to localStorage, so the pre-hydration
// script in layout.tsx can write the saved theme without re-running this
// logic (or shipping the full themes table to <head>).
function computeVars(t: Theme): Record<string, string> {
  const accent = resolveAccent(t);
  const vars: Record<string, string> = {
    "--bg": t.background,
    "--fg": t.foreground,
    "--fg-muted": hexToRgba(t.foreground, 0.66),
    "--fg-dim": hexToRgba(t.foreground, 0.42),
    "--surface": hexToRgba(t.foreground, 0.06),
    "--surface-strong": hexToRgba(t.foreground, 0.1),
    "--border": hexToRgba(t.foreground, 0.14),
    "--border-strong": hexToRgba(t.foreground, 0.24),
    "--hover": hexToRgba(t.foreground, 0.08),
    "--accent": accent,
    "--accent-soft": hexToRgba(accent, 0.16),
    "--accent-fg": luminance(accent) > 0.55 ? "#000000" : "#ffffff",
    "--selection-bg": t.selectionBg || accent,
    "--selection-fg": t.selectionFg || t.background,
  };
  t.palette.forEach((c, i) => {
    vars[`--c${i}`] = c;
  });
  return vars;
}

function applyTheme(t: Theme) {
  const vars = computeVars(t);
  const s = document.body.style;
  for (const [name, value] of Object.entries(vars)) {
    s.setProperty(name, value);
  }
  document.body.dataset.themeKind = luminance(t.background) > 0.5 ? "light" : "dark";
  try {
    localStorage.setItem(VARS_STORAGE_KEY, JSON.stringify(vars));
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themes = THEMES;
  const fallback = useMemo(
    () => themes.find((t) => t.name === DEFAULT_NAME) ?? themes[0],
    [themes]
  );
  const [active, setActive] = useState<Theme>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let initial: Theme = fallback;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const match = themes.find((t) => t.name === saved);
        if (match) initial = match;
      }
    } catch {
      /* localStorage unavailable */
    }
    setActive(initial);
    applyTheme(initial);
    setHydrated(true);
  }, [fallback, themes]);

  const setActiveName = useCallback(
    (name: string) => {
      const match = themes.find((t) => t.name === name);
      if (!match) return;
      setActive(match);
      applyTheme(match);
      try {
        localStorage.setItem(STORAGE_KEY, match.name);
      } catch {
        /* ignore */
      }
    },
    [themes]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ themes, featuredCount: FEATURED_COUNT, active, hydrated, setActiveName }),
    [themes, active, hydrated, setActiveName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

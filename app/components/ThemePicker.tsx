"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useThemeContext } from "./ThemeProvider";

export function ThemePicker() {
  const { themes, featuredCount, active, setActiveName } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (wrapRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Focus the search input when the menu opens; reset the query when it closes.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open]);

  const { featured, rest } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const featuredAll = themes.slice(0, featuredCount);
    const restAll = themes.slice(featuredCount);
    if (!q) return { featured: featuredAll, rest: restAll };
    const match = (t: { name: string }) => t.name.toLowerCase().includes(q);
    return { featured: featuredAll.filter(match), rest: restAll.filter(match) };
  }, [themes, featuredCount, query]);

  const hasResults = featured.length > 0 || rest.length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-theme-fg-muted hover:bg-theme-hover hover:text-theme-fg"
      >
        <span
          aria-hidden="true"
          className="inline-block h-[11px] w-[11px] rounded-[3px] border border-theme-border-strong"
          style={{ background: "var(--accent)" }}
        />
        <span>{active.name}</span>
        <svg viewBox="0 0 12 12" width="10" height="10" className="opacity-55" aria-hidden="true">
          <path
            d="M2 4 L6 8 L10 4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 top-[calc(100%+6px)] z-50 flex max-h-[420px] w-[280px] flex-col overflow-hidden rounded-lg border border-theme-border-strong bg-theme-bg"
        >
          <div className="flex items-center gap-2 border-b border-theme-border bg-theme-bg px-2 py-1.5">
            <Search size={13} strokeWidth={1.75} className="text-theme-fg-dim" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search themes…"
              className="w-full bg-transparent text-[13px] text-theme-fg placeholder:text-theme-fg-dim focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-1.5">
            {featured.map((t) => (
              <ThemeRow
                key={t.name}
                theme={t}
                active={t.name === active.name}
                onPick={() => {
                  setActiveName(t.name);
                  setOpen(false);
                }}
              />
            ))}
            {featured.length > 0 && rest.length > 0 && (
              <div role="separator" className="my-1.5 mx-1 h-px bg-theme-border" />
            )}
            {rest.map((t) => (
              <ThemeRow
                key={t.name}
                theme={t}
                active={t.name === active.name}
                onPick={() => {
                  setActiveName(t.name);
                  setOpen(false);
                }}
              />
            ))}
            {!hasResults && (
              <div className="px-2 py-6 text-center text-[12px] text-theme-fg-dim">
                No themes match “{query}”
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeRow({
  theme,
  active,
  onPick,
}: {
  theme: { name: string; palette: string[] };
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onPick}
      className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] text-theme-fg hover:bg-theme-hover ${
        active ? "bg-theme-accent-soft" : ""
      }`}
    >
      <span className="flex-1 truncate">{theme.name}</span>
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-sm border border-theme-border"
            style={{ background: theme.palette[i] }}
          />
        ))}
      </span>
    </button>
  );
}

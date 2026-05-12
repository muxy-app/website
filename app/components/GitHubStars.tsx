"use client";

import { useEffect, useState } from "react";

const REPO_URL = "https://github.com/muxy-app/muxy";
const CACHE_KEY = "muxy.website.githubStars";
const TTL_MS = 24 * 60 * 60 * 1000; // 24h

type CacheEntry = { count: number; ts: number };

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CacheEntry>;
    if (typeof parsed.count !== "number" || typeof parsed.ts !== "number") return null;
    return { count: parsed.count, ts: parsed.ts };
  } catch {
    return null;
  }
}

function writeCache(entry: CacheEntry) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* storage full / disabled — ignore */
  }
}

export function GitHubStars() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached) setCount(cached.count);

    if (cached && Date.now() - cached.ts < TTL_MS) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://api.github.com/repos/muxy-app/muxy", {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) return;
        const data: { stargazers_count?: number } = await res.json();
        if (cancelled || typeof data.stargazers_count !== "number") return;
        const next = data.stargazers_count;
        writeCache({ count: next, ts: Date.now() });
        setCount((prev) => (prev === next ? prev : next));
      } catch {
        /* offline or rate-limited — keep the cached value */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Hide the button entirely until we have a count, so the icon never appears
  // alone for a frame. Reserves no space — the topline just shifts when ready.
  if (count == null) return null;

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-theme-fg-muted hover:bg-theme-hover hover:text-theme-fg hover:no-underline"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.39 0-.19-.01-.7-.01-1.37-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.16-.89-1.16-.73-.5.06-.49.06-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.49 0 1.07-.01 1.94-.01 2.2 0 .22.15.46.55.39A8 8 0 0 0 8 0z"
        />
      </svg>
      <span>{count.toLocaleString()}</span>
    </a>
  );
}

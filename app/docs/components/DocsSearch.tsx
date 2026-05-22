"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchRecord } from "@/lib/docs";

export function DocsSearch({ records }: { records: SearchRecord[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(records, query), [records, query]);

  return (
    <div className="relative mb-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search docs..."
        className="w-full border-0 border-b border-theme-border bg-transparent px-0 py-2 text-[13px] text-theme-fg outline-none placeholder:text-theme-fg-dim focus:border-theme-border-strong"
      />
      {query.trim() ? (
        <div className="mt-2 max-h-[360px] overflow-auto rounded-lg border border-theme-border bg-theme-bg p-1 shadow-2xl">
          {results.length ? (
            results.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                onClick={() => setQuery("")}
                className="block rounded-md px-2.5 py-2 hover:bg-theme-hover hover:no-underline"
              >
                <div className="text-[13px] font-medium text-theme-fg">{result.heading}</div>
                <div className="text-[12px] text-theme-fg-dim">{result.title}</div>
                <p className="m-0 mt-1 line-clamp-2 text-[12px] leading-snug text-theme-fg-muted">{result.text}</p>
              </Link>
            ))
          ) : (
            <div className="px-2.5 py-3 text-[12px] text-theme-fg-dim">No results found.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function search(records: SearchRecord[], query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return records
    .map((record) => {
      const title = record.title.toLowerCase();
      const heading = record.heading.toLowerCase();
      const text = record.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 8;
        if (heading.includes(term)) score += 5;
        if (text.includes(term)) score += 1;
      }
      return { record, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((item) => item.record);
}

import type { DocHeading } from "@/lib/docs";

export function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const items = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
  if (!items.length) return null;

  return (
    <nav className="hidden xl:block" aria-label="On this page">
      <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-auto pl-5 text-[12px]">
        <div className="mb-2 font-medium text-theme-fg">On this page</div>
        <div className="space-y-1">
          {items.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className="block rounded px-2 py-1 text-theme-fg-muted hover:bg-theme-hover hover:text-theme-fg hover:no-underline"
              style={{ paddingLeft: heading.depth === 3 ? 18 : 8 }}
            >
              {heading.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

import Link from "next/link";
import type { SidebarItem } from "@/lib/docs";

export function DocsSidebar({ items, currentHref }: { items: SidebarItem[]; currentHref: string }) {
  return (
    <nav className="space-y-1 text-[13px]" aria-label="Documentation">
      <Link
        href="/docs"
        className={`block px-2.5 py-1.5 hover:no-underline ${
          currentHref === "/docs" ? "text-theme-fg" : "text-theme-fg-muted hover:text-theme-fg"
        }`}
      >
        Overview
      </Link>
      {items.map((item) => (
        <SidebarNode key={`${item.href ?? item.title}`} item={item} currentHref={currentHref} />
      ))}
    </nav>
  );
}

function SidebarNode({ item, currentHref, depth = 0 }: { item: SidebarItem; currentHref: string; depth?: number }) {
  const active = item.href === currentHref;
  const label = item.href ? (
    <Link
      href={item.href}
      className={`block px-2.5 py-1.5 hover:no-underline ${
        active ? "text-theme-fg" : "text-theme-fg-muted hover:text-theme-fg"
      }`}
      style={{ paddingLeft: `${10 + depth * 12}px` }}
    >
      {item.title}
    </Link>
  ) : (
    <div
      className="px-2.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-theme-fg-dim"
      style={{ paddingLeft: `${10 + depth * 12}px` }}
    >
      {item.title}
    </div>
  );

  return (
    <div>
      {label}
      {item.children?.length ? (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => (
            <SidebarNode key={`${child.href ?? child.title}`} item={child} currentHref={currentHref} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

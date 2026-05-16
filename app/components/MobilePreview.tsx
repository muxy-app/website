// Three iPhone replicas in a flat, left-aligned row. Each phone shows a
// different real screen from the Muxy mobile app (projects list, terminal
// session, git overview). On narrow viewports the row becomes a horizontal
// scroller — the first phone fully visible, the next peeking in from the
// right edge as a swipe affordance.

import {
  ArrowDown,
  ArrowUp,
  BatteryFull,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  FolderOpen,
  GitBranch,
  GitPullRequest,
  Plus,
  Settings,
  Wifi,
} from "lucide-react";

type Project = {
  key: string;
  name: string;
  path: string;
  bg: string;
  initial?: string;
  icon?: React.ReactNode;
};

const PROJECTS: Project[] = [
  {
    key: "muxy",
    name: "muxy",
    path: "/Users/saeed/Projects/muxy/",
    bg: "linear-gradient(135deg,#22D3EE,#6366F1 50%,#EC4899)",
    icon: (
      <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
        <path d="M3 3 L8 8 L3 13 M8 3 L13 8 L8 13" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  { key: "muxy-mobile", name: "muxy-mobile", path: "/Users/saeed/Projects/muxy-mobile/", bg: "linear-gradient(135deg,#22D3EE,#6366F1)", initial: "M" },
  {
    key: "draftila",
    name: "draftila",
    path: "/Users/saeed/Projects/draftila/",
    bg: "linear-gradient(135deg,#ec4899,#f472b6)",
    icon: (
      <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
        <rect x="3" y="3" width="3" height="3" fill="white" />
        <rect x="10" y="3" width="3" height="3" fill="white" />
        <rect x="3" y="10" width="3" height="3" fill="white" />
        <rect x="10" y="10" width="3" height="3" fill="white" />
      </svg>
    ),
  },
  { key: "capty-app", name: "capty-app", path: "/Users/saeed/Projects/capty/app/", bg: "linear-gradient(135deg,#0ea5e9,#22d3ee)", initial: "C" },
  { key: "capty-website", name: "capty-website", path: "/Users/saeed/Projects/capty/website/", bg: "linear-gradient(135deg,#0ea5e9,#3b82f6)", initial: "C" },
  { key: "vito", name: "vito", path: "/Users/saeed/Projects/vito/", bg: "linear-gradient(135deg,#6366f1,#a855f7)", initial: "V" },
  { key: "freeipapi", name: "freeipapi", path: "/Users/saeed/Projects/freeipapi/", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", initial: "F" },
];

export function MobilePreview() {
  return (
    <div aria-label="Muxy mobile remote preview">
      {/* Desktop / wide: three phones in a flat, left-aligned row */}
      <div className="hidden md:flex md:items-start md:gap-5">
        <div className="w-[260px] flex-shrink-0">
          <PhoneFrame time="9:41">
            <ProjectsScreen />
          </PhoneFrame>
        </div>
        <div className="w-[260px] flex-shrink-0">
          <PhoneFrame time="9:41">
            <TerminalScreen />
          </PhoneFrame>
        </div>
        <div className="w-[260px] flex-shrink-0">
          <PhoneFrame time="9:41">
            <GitScreen />
          </PhoneFrame>
        </div>
      </div>

      {/* Narrow: carousel */}
      <div className="md:hidden">
        <PhoneCarousel />
      </div>
    </div>
  );
}

function PhoneFrame({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <div className="relative aspect-[9/19.5] overflow-hidden rounded-[36px] border border-theme-border-strong bg-theme-bg">
      {/* Notch */}
      <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[22px] w-[100px] -translate-x-1/2 rounded-full bg-black/80" />

      {/* Status bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[11px] font-medium text-theme-fg">
        <span>{time}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-theme-fg-dim">····</span>
          <Wifi size={12} strokeWidth={2} />
          <BatteryFull size={14} strokeWidth={2} />
        </span>
      </div>

      {/* Screen content */}
      <div className="relative h-[calc(100%-44px)]">{children}</div>

      {/* Home indicator */}
      <div className="absolute inset-x-0 bottom-1.5 flex justify-center">
        <span className="h-[3px] w-[100px] rounded-full bg-theme-fg-dim/70" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Narrow-viewport carousel
// ---------------------------------------------------------------------------

function PhoneCarousel() {
  return (
    <div
      className="-mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 pr-[40%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {[<ProjectsScreen key="p" />, <TerminalScreen key="t" />, <GitScreen key="g" />].map(
        (screen, i) => (
          <div key={i} className="w-[240px] flex-shrink-0 snap-start">
            <PhoneFrame time="9:41">{screen}</PhoneFrame>
          </div>
        ),
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen 1: Projects list
// ---------------------------------------------------------------------------

function ProjectsScreen() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="Settings"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-surface-strong text-theme-fg"
        >
          <Settings size={14} strokeWidth={1.75} />
        </button>
        <span className="flex-1 truncate text-center text-[14px] font-semibold text-theme-fg">Mac Main</span>
        <button
          type="button"
          aria-label="Add device"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-surface-strong text-theme-fg"
        >
          <Plus size={14} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden px-3">
        <div className="flex flex-col gap-2">
          {PROJECTS.map((p) => (
            <div
              key={p.key}
              className="flex w-full items-center gap-3 rounded-xl border border-theme-border bg-theme-surface px-3 py-2.5"
            >
              <span
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-sans text-[14px] font-bold text-white shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.18)]"
                style={{ background: p.bg }}
              >
                {p.icon ?? p.initial}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] font-semibold text-theme-fg">{p.name}</span>
                <span className="truncate text-[10.5px] text-theme-fg-dim">{p.path}</span>
              </span>
              <ChevronRight size={13} strokeWidth={2} className="text-theme-fg-dim" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen 2: Terminal session
// ---------------------------------------------------------------------------

function TerminalScreen() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="Back"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-surface-strong text-theme-fg"
        >
          <ChevronLeft size={15} strokeWidth={2} />
        </button>
        <span className="flex-1 truncate text-center text-[13px] font-semibold text-theme-fg">muxy</span>
        <button
          type="button"
          aria-label="Git"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-surface-strong text-theme-fg"
        >
          <GitBranch size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* Tab strip */}
      <div className="flex items-center gap-1.5 overflow-hidden px-3 pb-2 text-[11px]">
        <TabPill icon={<TerminalGlyph />} label="zsh" active />
        <TabPill icon={<TerminalGlyph />} label="server" />
        <TabPill icon={<GitBranch size={10} strokeWidth={1.75} />} label="vcs" />
      </div>

      {/* Terminal body */}
      <div className="flex-1 overflow-hidden px-4 pb-2 pt-1 font-mono text-[11px] leading-[1.5] text-theme-fg">
        <div>
          <span style={{ color: "var(--c2)" }}>saeed@mac</span>
          <span className="text-theme-fg-dim"> in </span>
          <span style={{ color: "var(--c4)" }}>~/Projects/muxy</span>
          <span className="text-theme-fg-dim"> on </span>
          <span style={{ color: "var(--c3)" }}>main</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span style={{ color: "var(--accent)" }}>❯</span>
          <span>claude</span>
        </div>

        <div className="mt-3 flex items-start gap-2">
          <ClaudeMascot />
          <div className="min-w-0 flex-1">
            <div>
              <span className="font-bold text-theme-fg">Claude Code</span>{" "}
              <span className="text-theme-fg-dim">v2.1.133</span>
            </div>
            <div className="text-theme-fg-muted">Opus 4.7 · Claude Max</div>
            <div className="text-theme-fg-muted">~/Projects/muxy</div>
          </div>
        </div>

        <div className="my-2 border-t border-theme-border" />

        <div className="text-theme-fg-muted">
          <span style={{ color: "var(--c1)" }}>▶▶</span>{" "}
          <span style={{ color: "var(--c1)" }}>bypass perms on</span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span style={{ color: "var(--accent)" }}>❯</span>
          <span className="text-theme-fg-dim">Try &ldquo;edit AppState.swift to…&rdquo;</span>
        </div>
      </div>

      {/* Modifier strip */}
      <div className="flex items-center gap-1 px-3 pt-1 pb-2 text-[10px]">
        <ModKey symbol="⌃" label="ctrl" />
        <ModKey symbol="⇧" label="shift" />
        <ModKey symbol="⌥" label="alt" />
        <ModKey symbol="⌘" label="cmd" />
      </div>

      {/* Key accessory bar */}
      <div className="flex items-center gap-1 border-t border-theme-border px-3 py-2.5">
        <KeyChip>esc</KeyChip>
        <KeyChip>tab</KeyChip>
        <KeyChip>~</KeyChip>
        <KeyChip>|</KeyChip>
        <KeyChip>/</KeyChip>
        <KeyChip>
          <Clipboard size={11} strokeWidth={1.75} />
        </KeyChip>
        <span className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-theme-surface-strong">
          <ChevronUp size={12} strokeWidth={2} className="text-theme-fg-muted" />
        </span>
      </div>
    </div>
  );
}

function TabPill({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-1 ${
        active
          ? "bg-theme-surface-strong text-theme-fg"
          : "border border-theme-border text-theme-fg-muted"
      }`}
      style={active ? { boxShadow: "inset 0 0 0 1px var(--accent-soft)" } : undefined}
    >
      {icon}
      {label}
    </span>
  );
}

function ModKey({ symbol, label }: { symbol: string; label: string }) {
  return (
    <span className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-md border border-theme-border bg-theme-surface text-theme-fg-muted">
      <span className="text-[11px] text-theme-fg">{symbol}</span>
      <span>{label}</span>
    </span>
  );
}

function KeyChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-theme-surface px-2 text-[11px] text-theme-fg-muted">
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Screen 3: Git overview
// ---------------------------------------------------------------------------

function GitScreen() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="Close"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-surface-strong text-theme-fg"
        >
          <ChevronLeft size={15} strokeWidth={2} />
        </button>
        <span className="flex-1 truncate text-center text-[14px] font-semibold text-theme-fg">Git</span>
        <span className="inline-flex h-8 w-8 items-center justify-center" />
      </div>

      <div className="flex-1 overflow-hidden px-3 pb-3">
        {/* Branch card */}
        <div className="rounded-xl border border-theme-border bg-theme-surface p-3">
          <div className="flex items-center gap-2">
            <GitBranch size={14} strokeWidth={1.75} style={{ color: "var(--accent)" }} />
            <span className="truncate text-[14px] font-semibold text-theme-fg">main</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-theme-fg-muted">
            <ArrowDown size={11} strokeWidth={2} />
            <span>1</span>
            <ArrowUp size={11} strokeWidth={2} className="ml-2" />
            <span>2</span>
          </div>
        </div>

        {/* Action grid */}
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          <GitAction icon={<ArrowDown size={14} strokeWidth={1.75} />} label="Pull" />
          <GitAction icon={<ArrowUp size={14} strokeWidth={1.75} />} label="Push" badge="2" />
          <GitAction icon={<CheckCircle2 size={14} strokeWidth={1.75} />} label="Commit" badge="3" />
          <GitAction icon={<GitPullRequest size={14} strokeWidth={1.75} />} label="PR" />
        </div>

        {/* Manage section */}
        <div className="mt-3">
          <span className="px-1 text-[10.5px] uppercase tracking-wider text-theme-fg-dim">Manage</span>
          <div className="mt-1 overflow-hidden rounded-xl border border-theme-border bg-theme-surface">
            <GitRow icon={<GitBranch size={14} strokeWidth={1.75} />} title="Branches" subtitle="main" />
            <div className="h-px bg-theme-border" />
            <GitRow icon={<FolderOpen size={14} strokeWidth={1.75} />} title="Worktrees" />
          </div>
        </div>

        {/* Changes section */}
        <div className="mt-3">
          <span className="px-1 text-[10.5px] uppercase tracking-wider text-theme-fg-dim">Changes (3)</span>
          <div className="mt-1 overflow-hidden rounded-xl border border-theme-border bg-theme-surface">
            <ChangeRow name="settings.tsx" path="app/settings.tsx" status="modified" color="var(--c3)" />
            <div className="h-px bg-theme-border" />
            <ChangeRow name="WSClient.ts" path="src/transport/WSClient.ts" status="modified" color="var(--c3)" />
            <div className="h-px bg-theme-border" />
            <ChangeRow name="demo.md" path="docs/demo.md" status="added" color="var(--c2)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GitAction({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-1 rounded-xl border border-theme-border bg-theme-surface py-2.5 text-theme-fg">
      {icon}
      <span className="text-[10.5px]">{label}</span>
      {badge && (
        <span
          className="absolute right-1.5 top-1.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[9px] font-bold"
          style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function GitRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <span className="text-theme-fg-muted">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[12px] font-medium text-theme-fg">{title}</span>
        {subtitle && <span className="truncate text-[10.5px] text-theme-fg-dim">{subtitle}</span>}
      </span>
      <ChevronRight size={13} strokeWidth={2} className="text-theme-fg-dim" />
    </div>
  );
}

function ChangeRow({
  name,
  path,
  status,
  color,
}: {
  name: string;
  path: string;
  status: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[12px] font-medium text-theme-fg">{name}</span>
        <span className="truncate text-[10px] text-theme-fg-dim">{path}</span>
      </span>
      <span
        className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white"
        style={{ background: color }}
      >
        {status}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Decorative
// ---------------------------------------------------------------------------

function TerminalGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <path d="M5 6.5 L7 8 L5 9.5 M8 9.5 H11" stroke="currentColor" strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClaudeMascot() {
  const c = "#d2715a";
  const e = "#1a1a1a";
  return (
    <svg viewBox="0 0 14 12" width="32" height="28" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={c}>
        <rect x="1" y="1" width="12" height="1" />
        <rect x="0" y="2" width="14" height="1" />
        <rect x="0" y="3" width="14" height="1" />
        <rect x="0" y="4" width="14" height="1" />
        <rect x="0" y="5" width="14" height="1" />
        <rect x="0" y="6" width="14" height="1" />
        <rect x="1" y="7" width="12" height="1" />
        <rect x="2" y="8" width="2" height="1" />
        <rect x="6" y="8" width="2" height="1" />
        <rect x="10" y="8" width="2" height="1" />
      </g>
      <g fill={e}>
        <rect x="3" y="3" width="2" height="2" />
        <rect x="9" y="3" width="2" height="2" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CTA pill row (used outside this component, exported for the page)
// ---------------------------------------------------------------------------

export function MobileCTAs() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2.5">
      <a
        href="https://apps.apple.com/us/app/muxy/id6762464046"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-theme-border px-3 py-1.5 text-[13px] text-theme-fg hover:no-underline hover:bg-theme-hover active:translate-y-px"
      >
        <AppleGlyph />
        App Store
      </a>
      <a
        href="https://github.com/muxy-app/mobile#android-closed-testing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-theme-border px-3 py-1.5 text-[13px] text-theme-fg hover:no-underline hover:bg-theme-hover active:translate-y-px"
      >
        <PlayGlyph />
        Google Play
      </a>
      <a
        href="/ios-beta"
        className="inline-flex items-center gap-1.5 rounded-md border border-theme-border px-3 py-1.5 text-[13px] text-theme-fg hover:no-underline hover:bg-theme-hover active:translate-y-px"
      >
        Join the iOS beta
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M11.182 8.567a2.93 2.93 0 0 1 1.395-2.46 3.005 3.005 0 0 0-2.37-1.28c-.997-.105-1.964.595-2.473.595-.519 0-1.301-.582-2.144-.566a3.16 3.16 0 0 0-2.659 1.622C1.78 8.554 2.65 12.082 3.74 14.01c.545.948 1.183 2.005 2.024 1.974.812-.033 1.118-.526 2.1-.526s1.258.526 2.115.51c.875-.016 1.428-.953 1.963-1.91a8.4 8.4 0 0 0 .898-1.85 2.85 2.85 0 0 1-1.658-2.641ZM9.566 3.81a2.857 2.857 0 0 0 .654-2.046 2.929 2.929 0 0 0-1.9.978 2.732 2.732 0 0 0-.67 1.972 2.42 2.42 0 0 0 1.916-.904Z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M2.5 1.5 v13 L9 8 z" fill="#34d399" />
      <path d="M2.5 1.5 L9 8 L11.5 5.5 z" fill="#60a5fa" />
      <path d="M2.5 14.5 L9 8 L11.5 10.5 z" fill="#fb7185" />
      <path d="M11.5 5.5 L13.5 7.2 a1 1 0 0 1 0 1.6 L11.5 10.5 L9 8 z" fill="#fbbf24" />
    </svg>
  );
}

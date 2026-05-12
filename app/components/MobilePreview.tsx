// Static iPhone replica of the Muxy mobile remote. Two screens (Projects list
// and Terminal session) the user can toggle between. Visible only on phones —
// the desktop AppPreview takes over at the md breakpoint.

"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clipboard,
  GitBranch,
  Wifi,
  BatteryFull,
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

type Screen = "projects" | "terminal";

export function MobilePreview() {
  const [screen, setScreen] = useState<Screen>("projects");

  return (
    <section className="mb-16 md:hidden" aria-label="Muxy mobile remote preview">
      <div className="mx-auto w-full max-w-[320px]">
        {/* iPhone frame */}
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[36px] border border-theme-border-strong bg-theme-bg">
          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[22px] w-[100px] -translate-x-1/2 rounded-full bg-black/80" />

          {/* Status bar */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[11px] font-medium text-theme-fg">
            <span>19:1{screen === "projects" ? "3" : "4"}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-theme-fg-dim">····</span>
              <Wifi size={12} strokeWidth={2} />
              <BatteryFull size={14} strokeWidth={2} />
            </span>
          </div>

          {/* Screen content */}
          <div className="relative h-[calc(100%-44px)]">
            {screen === "projects" ? (
              <ProjectsScreen onOpen={() => setScreen("terminal")} />
            ) : (
              <TerminalScreen onBack={() => setScreen("projects")} />
            )}
          </div>
        </div>

        {/* Tiny screen-switch toggle below the phone */}
        <div className="mt-4 flex justify-center gap-2 text-[12px] text-theme-fg-muted">
          <button
            type="button"
            onClick={() => setScreen("projects")}
            className={`rounded-full px-3 py-1 ${
              screen === "projects"
                ? "bg-theme-surface-strong text-theme-fg"
                : "hover:bg-theme-hover"
            }`}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setScreen("terminal")}
            className={`rounded-full px-3 py-1 ${
              screen === "terminal"
                ? "bg-theme-surface-strong text-theme-fg"
                : "hover:bg-theme-hover"
            }`}
          >
            Terminal
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectsScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full bg-theme-surface-strong px-2.5 py-1.5 text-[13px] text-theme-fg"
        >
          <ChevronLeft size={13} strokeWidth={2} />
          Devices
        </button>
        <span className="text-[14px] font-medium text-theme-fg">Mac Main</span>
      </div>

      <div className="flex-1 overflow-hidden px-4">
        <div className="flex flex-col gap-2">
          {PROJECTS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={onOpen}
              className="flex w-full items-center gap-3 rounded-xl bg-theme-surface-strong px-3 py-2.5 text-left"
            >
              <span
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg font-sans text-[14px] font-bold text-white shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.18)]"
                style={{ background: p.bg }}
              >
                {p.icon ?? p.initial}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] font-medium text-theme-fg">{p.name}</span>
                <span className="truncate text-[10.5px] text-theme-fg-dim">{p.path}</span>
              </span>
              <ChevronRight size={13} strokeWidth={2} className="text-theme-fg-dim" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TerminalScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-full bg-theme-surface-strong px-2.5 py-1.5 text-[13px] text-theme-fg"
        >
          <ChevronLeft size={13} strokeWidth={2} />
          Mac Main
        </button>
        <span className="text-[14px] font-medium text-theme-fg">muxy</span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-surface-strong text-theme-fg">
          <GitBranch size={14} strokeWidth={1.75} />
        </span>
      </div>

      {/* Tab strip */}
      <div className="flex items-center gap-2 overflow-hidden px-4 pb-2 text-[11.5px]">
        <span className="flex-shrink-0 truncate text-theme-fg-dim">…nput-side-panel-re…</span>
        <span
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-theme-surface-strong px-2 py-1 text-theme-fg"
          style={{ boxShadow: "inset 0 0 0 1px var(--accent-soft)" }}
        >
          <TerminalGlyph />
          …/Projects/muxy/
        </span>
        <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-theme-fg-dim">
          <TerminalGlyph />
          saeed@…
        </span>
      </div>

      {/* Splash block */}
      <div className="border-t border-theme-border px-4 py-4 font-mono text-[12px] leading-[1.45]">
        <div className="flex items-start gap-3">
          <ClaudeMascot />
          <div className="min-w-0 flex-1">
            <div>
              <span className="font-bold text-theme-fg">Claude Code</span>{" "}
              <span className="text-theme-fg-dim">v2.1.133</span>
            </div>
            <div className="text-theme-fg-muted">
              Opus 4.7 (1M context) <span className="text-theme-fg-dim">·</span> Claude Max
            </div>
            <div className="text-theme-fg-muted">~/Projects/muxy</div>
          </div>
        </div>

        <div className="my-3 border-t border-theme-border" />

        <div className="flex items-center gap-2 text-theme-fg-dim">
          <span style={{ color: "var(--accent)" }}>)</span>
          <span>Try &ldquo;edit AppState.swift to…&rdquo;</span>
        </div>

        <div className="my-3 border-t border-theme-border" />

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span style={{ color: "var(--c1)" }}>▶▶</span>
          <span style={{ color: "var(--c1)" }}>bypass permissions on</span>
          <span className="text-theme-fg-dim">·</span>
          <span className="text-theme-fg-muted">PR</span>
          <span style={{ color: "var(--c3)", textDecoration: "underline" }}>#388</span>
        </div>
        <div className="mt-1 flex justify-end gap-2 text-theme-fg-muted">
          <span>
            <span style={{ color: "var(--c3)" }}>◉</span> xhigh
          </span>
          <span className="text-theme-fg-dim">·</span>
          <span>/effort</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Keyboard accessory bar */}
      <div className="flex items-center gap-1 border-t border-theme-border px-3 py-3">
        <KeyChip>esc</KeyChip>
        <KeyChip>
          ctrl <span className="text-theme-fg-dim">^</span>
        </KeyChip>
        <KeyChip>tab</KeyChip>
        <KeyChip>~</KeyChip>
        <KeyChip>/</KeyChip>
        <KeyChip>
          <Clipboard size={12} strokeWidth={1.75} />
        </KeyChip>
        <span className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-theme-surface-strong">
          <span className="block h-2.5 w-2.5 rounded-full bg-theme-fg-muted" />
        </span>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-1.5 pt-0.5">
        <span className="h-[3px] w-[100px] rounded-full bg-theme-fg-dim" />
      </div>
    </div>
  );
}

function KeyChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-theme-surface px-2 text-[11px] text-theme-fg-muted">
      {children}
    </span>
  );
}

function TerminalGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <path d="M5 6.5 L7 8 L5 9.5 M8 9.5 H11" stroke="currentColor" strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Tiny pixel-art mascot to match the Claude Code splash. Hand-rolled SVG
// so it stays crisp at any size.
function ClaudeMascot() {
  const c = "#d2715a";
  const e = "#1a1a1a";
  return (
    <svg viewBox="0 0 14 12" width="42" height="36" shapeRendering="crispEdges" aria-hidden="true">
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

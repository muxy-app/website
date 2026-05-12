// Left sidebar of the app replica: traffic lights + nav arrows on top, then
// the project list, then a footer toolbar. Sizing follows the Swift app
// (iconXXL = 28px, sidebarExpandedWidth = 220px, active bg = accentSoft).

import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Palette,
  PanelLeft,
  Plus,
  Zap,
} from "lucide-react";

type Project = {
  key: string;
  name: string;
  sub?: string;
  bg: string;
  initial?: string;
  icon?: React.ReactNode;
  active?: boolean;
  hasUpdate?: boolean; // shows accent dot in the icon's top-right corner
};

const PROJECTS: Project[] = [
  {
    key: "muxy",
    name: "muxy",
    sub: "primary",
    bg: "linear-gradient(135deg,#22D3EE,#6366F1 50%,#EC4899)",
    icon: (
      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        <path d="M3 3 L8 8 L3 13 M8 3 L13 8 L8 13" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    hasUpdate: true,
  },
  { key: "muxy-mobile", name: "muxy-mobile", sub: "primary", bg: "linear-gradient(135deg,#22D3EE,#6366F1)", initial: "M" },
  { key: "muxy-website", name: "muxy-website", bg: "linear-gradient(135deg,#7c3aed,#ec4899)", initial: "M", active: true },
  { key: "capty-app", name: "capty-app", sub: "primary", bg: "linear-gradient(135deg,#0ea5e9,#22d3ee)", initial: "C" },
  { key: "capty-website", name: "capty-website", sub: "primary", bg: "linear-gradient(135deg,#0ea5e9,#3b82f6)", initial: "C" },
  {
    key: "draftila",
    name: "draftila",
    sub: "primary",
    bg: "linear-gradient(135deg,#ec4899,#f472b6)",
    icon: (
      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        <rect x="3" y="3" width="3" height="3" fill="white" />
        <rect x="10" y="3" width="3" height="3" fill="white" />
        <rect x="3" y="10" width="3" height="3" fill="white" />
        <rect x="10" y="10" width="3" height="3" fill="white" />
      </svg>
    ),
  },
  { key: "vito", name: "vito", sub: "primary", bg: "linear-gradient(135deg,#6366f1,#a855f7)", initial: "V" },
  { key: "freeipapi", name: "freeipapi", sub: "primary", bg: "linear-gradient(135deg,#f59e0b,#ef4444)", initial: "F" },
  { key: "test-project", name: "test-project", sub: "primary", bg: "linear-gradient(135deg,#475569,#64748b)", initial: "T" },
];

export function ProjectSidebar() {
  return (
    <aside className="flex w-[220px] flex-shrink-0 flex-col border-r border-theme-border bg-theme-bg">
      <div className="flex h-[38px] items-center gap-2 border-b border-theme-border px-3">
        <TrafficLights />
        <NavArrows />
      </div>

      <div className="flex flex-1 flex-col gap-px overflow-hidden px-2 py-1">
        {PROJECTS.map((p) => (
          <ProjectRow key={p.key} project={p} />
        ))}
        <AddProjectRow />
      </div>

      <SidebarFooter />
    </aside>
  );
}

function TrafficLights() {
  return (
    <div className="inline-flex gap-1.5">
      <span className="inline-block h-[11px] w-[11px] rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.25)]" style={{ background: "#ff5f57" }} />
      <span className="inline-block h-[11px] w-[11px] rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.25)]" style={{ background: "#febc2e" }} />
      <span className="inline-block h-[11px] w-[11px] rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.25)]" style={{ background: "#28c840" }} />
    </div>
  );
}

function NavArrows() {
  return (
    <div className="ml-auto inline-flex items-center gap-0.5 text-theme-fg-dim">
      <button
        type="button"
        aria-label="Back"
        className="inline-flex h-6 w-5 items-center justify-center rounded-[4px] hover:bg-theme-hover hover:text-theme-fg"
      >
        <ChevronLeft size={14} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Forward"
        className="inline-flex h-6 w-5 items-center justify-center rounded-[4px] hover:bg-theme-hover hover:text-theme-fg"
      >
        <ChevronRight size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div
      className="relative flex items-center gap-2 rounded-lg px-1 py-1"
      style={project.active ? { background: "var(--accent-soft)" } : undefined}
    >
      <ProjectIcon bg={project.bg} initial={project.initial} icon={project.icon} hasUpdate={project.hasUpdate} />
      <div className="flex min-w-0 flex-1 flex-col font-sans">
        <span className={`truncate text-[13px] text-theme-fg ${project.active ? "font-semibold" : "font-medium"}`}>
          {project.name}
        </span>
        {project.sub && (
          <span className="truncate font-mono text-[11px] leading-[1.25] text-theme-fg">{project.sub}</span>
        )}
      </div>
      {project.sub && <ChevronRight size={13} strokeWidth={1.75} className="text-theme-fg" />}
    </div>
  );
}

function AddProjectRow() {
  return (
    <div className="relative flex items-center gap-2 rounded-lg px-1 py-1">
      <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-theme-surface-strong text-theme-fg-muted">
        <Plus size={16} strokeWidth={1.5} />
      </span>
      <span className="font-sans text-[13px] text-theme-fg-muted">Add Project</span>
    </div>
  );
}

function ProjectIcon({
  bg,
  initial,
  icon,
  hasUpdate,
}: {
  bg: string;
  initial?: string;
  icon?: React.ReactNode;
  hasUpdate?: boolean;
}) {
  return (
    <span className="relative inline-flex h-7 w-7 flex-shrink-0 items-center justify-center">
      <span
        className="absolute inset-0 rounded-md shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.18)]"
        style={{ background: bg }}
      />
      <span className="relative z-10 font-sans text-[13px] font-bold text-white">
        {icon ?? initial}
      </span>
      {hasUpdate && (
        <span
          className="absolute right-[-2px] top-[-2px] z-20 h-2 w-2 rounded-full"
          style={{ background: "var(--accent)", boxShadow: "0 0 0 1.5px var(--bg)" }}
        />
      )}
    </span>
  );
}

function SidebarFooter() {
  return (
    <div className="flex items-center gap-1.5 px-3 pb-3 pt-2 font-sans text-theme-fg-muted">
      <FootBtn label="Toggle sidebar"><PanelLeft size={14} strokeWidth={1.5} /></FootBtn>
      <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-theme-fg-muted">
        <Zap size={11} strokeWidth={1.5} />
        42%
      </span>
      <FootBtn label="Notifications"><Bell size={13} strokeWidth={1.5} /></FootBtn>
      <FootBtn label="Theme"><Palette size={13} strokeWidth={1.5} /></FootBtn>
    </div>
  );
}

function FootBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex items-center justify-center rounded p-1 text-current hover:bg-theme-hover hover:text-theme-fg"
    >
      {children}
    </button>
  );
}

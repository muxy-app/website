// Right-hand VCS panel: breadcrumb, commit box, Staged Changes / Changes /
// Pull Requests / History sections with their action icons.

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Columns2,
  File as FileIcon,
  Folder,
  FolderTree,
  Globe,
  History,
  Layers,
  Maximize2,
  Minus,
  PanelRight,
  Plus,
  RotateCw,
  Sparkles,
} from "lucide-react";

type Change = {
  name: string;
  status: "A" | "M" | "U";
  add?: number;
  remove?: number;
};

// Shorter, varied set so the panel doesn't feel monotone.
const STAGED: Change[] = [
  { name: "themes/Zenburn", status: "A", add: 23 },
  { name: "themes/Rose Pine", status: "A", add: 41, remove: 0 },
  { name: "themes/Catppuccin", status: "M", add: 7, remove: 2 },
  { name: "tsconfig.json", status: "A", add: 12 },
  { name: "lib/themes.ts", status: "M", add: 3, remove: 1 },
];

export function VcsPanel() {
  return (
    <div className="flex w-[296px] min-h-0 flex-shrink-0 flex-col overflow-hidden bg-theme-bg font-sans text-[12px]">
      <Breadcrumb />
      <CommitBox />
      <Section title="Staged Changes" badge={STAGED.length} open variant="staged">
        {STAGED.map((c) => (
          <ChangeRow key={c.name} change={c} />
        ))}
      </Section>
      <Section title="Changes" badge={0} variant="changes" />
      <Section title="Pull Requests" badge={0} variant="prs" />
      <Section title="History" badge={0} open variant="history">
        <div className="py-6 text-center text-[11.5px] text-theme-fg-dim">No commits</div>
      </Section>
    </div>
  );
}

const BRANCH_NAME = "add-font-family-and-line-height";

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 text-[11.5px] text-theme-fg-muted">
      <Chip>
        <Layers size={11} strokeWidth={1.5} />
        <span className="text-theme-fg">muxy</span>
        <ChevronDown size={10} strokeWidth={1.75} className="text-theme-fg-dim" />
      </Chip>
      <Chip>
        <Clock size={11} strokeWidth={1.5} />
        <span className="text-theme-fg">PR #423</span>
        <ChevronDown size={10} strokeWidth={1.75} className="text-theme-fg-dim" />
      </Chip>
      <span className="flex-1" />
      <SmallIcon label="Open in browser"><Globe size={11} strokeWidth={1.5} /></SmallIcon>
      <SmallIcon label="Hide panel"><PanelRight size={11} strokeWidth={1.5} /></SmallIcon>
      <SmallIcon label="Refresh"><RotateCw size={11} strokeWidth={1.5} /></SmallIcon>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[5px] border border-theme-border bg-theme-surface px-2 py-0.5 text-theme-fg-muted">
      {children}
    </span>
  );
}

function CommitBox() {
  return (
    <div className="mx-3 mb-2">
      <div className="relative min-h-[78px] rounded-md border border-theme-border bg-theme-surface px-3 pb-3 pr-7 pt-2 text-[12px] text-theme-fg-dim">
        <span className="block truncate">Commit message (⌘↵ to commit on {BRANCH_NAME})</span>
        <Sparkles
          size={13}
          strokeWidth={1.5}
          className="absolute right-2 top-2 text-theme-fg-dim"
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex gap-1.5">
        <Pill disabled className="flex-1">
          <Check size={11} strokeWidth={1.75} />
          Commit
        </Pill>
        <Pill>
          <ArrowDown size={11} strokeWidth={1.75} />
          Pull
        </Pill>
        <Pill>
          <ArrowUp size={11} strokeWidth={1.75} />
          Push
        </Pill>
      </div>
    </div>
  );
}

function Pill({
  children,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-[5px] border border-theme-border bg-theme-surface px-3 py-1.5 font-sans text-[12px] font-medium text-theme-fg ${
        disabled ? "cursor-default text-theme-fg-dim opacity-70" : "cursor-pointer hover:bg-theme-surface-strong"
      } ${className}`}
    >
      {children}
    </button>
  );
}

type SectionVariant = "staged" | "changes" | "prs" | "history";

function Section({
  title,
  badge,
  open,
  variant,
  children,
}: {
  title: string;
  badge: number;
  open?: boolean;
  variant: SectionVariant;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-t border-theme-border first:border-t-0">
      <div className="flex cursor-default items-center gap-1.5 px-3 py-2 text-[11.5px] text-theme-fg-muted hover:text-theme-fg">
        <Caret open={!!open} />
        <span className="font-medium text-theme-fg">{title}</span>
        <Badge>{badge}</Badge>
        <span className="flex-1" />
        <SectionActions variant={variant} />
      </div>
      {open && children}
    </div>
  );
}

function Caret({ open }: { open: boolean }) {
  const Icon = open ? ChevronDown : ChevronRight;
  return <Icon size={11} strokeWidth={1.75} className="text-theme-fg-dim" />;
}

function SectionActions({ variant }: { variant: SectionVariant }) {
  if (variant === "staged" || variant === "changes") {
    return (
      <>
        <SmallIcon label="Group by folder"><FolderTree size={11} strokeWidth={1.5} /></SmallIcon>
        <SmallIcon label="Split view"><Columns2 size={11} strokeWidth={1.5} /></SmallIcon>
        <SmallIcon label="Expand"><Maximize2 size={11} strokeWidth={1.5} /></SmallIcon>
        <SmallIcon label={variant === "staged" ? "Unstage all" : "Stage all"}>
          {variant === "staged" ? <Minus size={11} strokeWidth={1.75} /> : <Plus size={11} strokeWidth={1.75} />}
        </SmallIcon>
      </>
    );
  }
  if (variant === "prs") {
    return (
      <>
        <SmallIcon label="History"><History size={11} strokeWidth={1.5} /></SmallIcon>
        <SmallIcon label="Refresh"><RotateCw size={11} strokeWidth={1.5} /></SmallIcon>
      </>
    );
  }
  return <SmallIcon label="Refresh"><RotateCw size={11} strokeWidth={1.5} /></SmallIcon>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-theme-surface-strong px-[7px] py-px font-sans text-[10px] text-theme-fg-muted">
      {children}
    </span>
  );
}

function ChangeRow({ change }: { change: Change }) {
  const statusColor =
    change.status === "A" ? "var(--c2)" : change.status === "M" ? "var(--c3)" : "var(--c5)";
  return (
    <div className="flex cursor-default items-center gap-1.5 py-1 pl-7 pr-3 text-[11.5px] text-theme-fg hover:bg-theme-hover">
      <ChevronRight size={10} strokeWidth={1.75} className="text-theme-fg-dim" />
      <span className="w-3 text-center text-[11px] font-bold" style={{ color: statusColor }}>
        {change.status}
      </span>
      <FileIcon size={11} strokeWidth={1.5} className="text-theme-fg-dim" />
      <span className="truncate text-theme-fg">{change.name}</span>
      <span className="flex-1" />
      {typeof change.add === "number" && (
        <span className="pl-1 text-[10.5px] tabular-nums" style={{ color: "var(--c2)" }}>
          +{change.add.toLocaleString()}
        </span>
      )}
      {typeof change.remove === "number" && (
        <span className="pl-0.5 text-[10.5px] tabular-nums" style={{ color: "var(--c1)", opacity: 0.7 }}>
          -{change.remove}
        </span>
      )}
    </div>
  );
}

function SmallIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex items-center justify-center rounded p-1 text-theme-fg-muted hover:bg-theme-hover hover:text-theme-fg"
    >
      {children}
    </button>
  );
}

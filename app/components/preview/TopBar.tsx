// Top bar: tab strip + right-side action icons.
// Nav arrows live in the ProjectSidebar's top strip (next to traffic lights).

import {
  File as FileIcon,
  FileText,
  Folder,
  PanelLeft,
  PanelRight,
  Plus,
  X,
} from "lucide-react";

type Tab = {
  key: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  closable?: boolean;
};

const TABS: Tab[] = [
  {
    key: "project",
    label: "…rojects/muxy-website/",
    icon: <Folder size={12} strokeWidth={1.5} />,
    active: true,
    closable: true,
  },
  {
    key: "themes",
    label: "themes.js",
    icon: <FileText size={12} strokeWidth={1.5} />,
  },
];

export function TopBar() {
  return (
    <div className="flex h-[38px] items-stretch border-b border-theme-border pr-2">
      <div className="flex min-w-0 flex-1 items-stretch overflow-hidden">
        {TABS.map((t) => (
          <TabItem key={t.key} tab={t} />
        ))}
      </div>
      <div className="inline-flex items-center gap-0.5 px-1.5 text-theme-fg-muted">
        <IconBtn label="Toggle left panel"><PanelLeft size={14} strokeWidth={1.5} /></IconBtn>
        <IconBtn label="New tab"><Plus size={14} strokeWidth={1.75} /></IconBtn>
        <IconBtn label="File"><FileIcon size={14} strokeWidth={1.5} /></IconBtn>
        <IconBtn label="Toggle right panel"><PanelRight size={14} strokeWidth={1.5} /></IconBtn>
      </div>
    </div>
  );
}

function TabItem({ tab }: { tab: Tab }) {
  return (
    <div
      className={`relative inline-flex h-full max-w-[260px] cursor-default items-center gap-[7px] border-r border-theme-border px-3 font-sans text-[12px] ${
        tab.active ? "text-theme-fg" : "text-theme-fg-muted hover:bg-theme-hover"
      }`}
    >
      <span className={tab.active ? "text-theme-fg" : "text-theme-fg-dim"}>{tab.icon}</span>
      <span className="truncate">{tab.label}</span>
      {tab.closable && (
        <button
          type="button"
          aria-label="Close tab"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded text-theme-fg-dim hover:bg-theme-hover hover:text-theme-fg"
        >
          <X size={11} strokeWidth={1.75} />
        </button>
      )}
      {tab.active && (
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]"
          style={{ background: "var(--accent)" }}
        />
      )}
    </div>
  );
}

function IconBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[5px] hover:bg-theme-hover hover:text-theme-fg"
    >
      {children}
    </button>
  );
}


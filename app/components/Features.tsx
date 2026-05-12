type Feature = { icon: string; title: string; body: React.ReactNode };

const FEATURES: Feature[] = [
  { icon: "▤", title: "Project-based workflow", body: "Organize terminals by project with persistent workspace state across restarts." },
  { icon: "⫶", title: "Vertical tabs", body: "Sidebar tab strip with drag-and-drop reordering, pinning, renaming, and middle-click close." },
  { icon: "⫿", title: "Split panes", body: "Horizontal and vertical splits with keyboard navigation and resizable dividers." },
  { icon: "⎇", title: "Built-in VCS", body: (<>Git status, diff (unified and split), commit history, branch picker, and PRs via <code className="rounded bg-theme-surface-strong px-1.5 py-px text-[11.5px]">gh</code>.</>) },
  { icon: "⌥", title: "Git worktrees", body: "Create, switch, and manage worktrees from the sidebar with per-pane branch tracking." },
  { icon: "⌗", title: "File tree", body: "Built-in project file browser with file operations and clipboard." },
  { icon: "⌕", title: "Find in files", body: "Project-wide text search with match preview, powered by ripgrep." },
  { icon: "⌘", title: "Quick open & command palette", body: "Fuzzy-find files and run commands without leaving the keyboard." },
  { icon: "✎", title: "Lightweight editor", body: "Native editor with syntax highlighting for most languages, search, and history." },
  { icon: "¶", title: "Markdown preview", body: "Render Markdown files inline next to your terminals." },
  { icon: "∑", title: "AI usage tracking", body: "Live token/cost panels for Claude Code, Codex, Cursor, Copilot, Amp, Factory, Kimi, MiniMax, OpenCode and Z.ai." },
  { icon: "↗", title: "IDE integration", body: "Open files and folders in your preferred IDE directly from Muxy." },
  { icon: "⌑", title: "Mobile companion apps", body: "Pair iOS and Android devices to control your Mac terminals remotely." },
  { icon: "⌬", title: "Rich input panel", body: "Compose multi-line input with image attachments and drafts before sending to the terminal." },
  { icon: "◐", title: "200+ themes", body: "Browse and search Ghostty themes with a built-in theme picker. This page uses them too." },
  { icon: "⌨", title: "Customizable shortcuts", body: "40+ configurable keyboard shortcuts with conflict detection." },
];

export function Features() {
  return (
    <section className="mb-20">
      <h2 className="m-0 mb-2 text-[clamp(22px,2.6vw,28px)] font-semibold tracking-[-0.4px]">
        Built for the way you actually work
      </h2>
      <p className="m-0 mb-7 max-w-[620px] text-theme-fg-muted">
        Everything below ships in Muxy today. See the{" "}
        <a href="https://github.com/muxy-app/muxy" target="_blank" rel="noopener noreferrer" className="text-theme-accent hover:underline">
          README
        </a>{" "}
        for the full list.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2.5">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="rounded-[9px] border border-theme-border bg-theme-surface p-4 transition-colors hover:border-theme-border-strong hover:bg-theme-surface-strong"
          >
            <div
              className="mb-2.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-[15px]"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {f.icon}
            </div>
            <h3 className="m-0 mb-1 text-[13.5px] font-semibold text-theme-fg">{f.title}</h3>
            <p className="m-0 text-[12.5px] leading-[1.5] text-theme-fg-muted">{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

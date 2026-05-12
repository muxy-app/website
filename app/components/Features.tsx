type Feature = { title: string; body: React.ReactNode };

const FEATURES: Feature[] = [
  {
    title: "Project-based workflow",
    body: "Organize terminals by project. Tabs, splits, and focus state persist across restarts.",
  },
  {
    title: "Built-in source control",
    body: (
      <>
        Git status, diff, history, branch picker, and PRs via{" "}
        <code className="rounded bg-theme-surface px-1 py-px text-[12px]">gh</code> — without leaving Muxy.
      </>
    ),
  },
  {
    title: "Worktrees, first class",
    body: "Create, switch, and manage Git worktrees from the sidebar with per-pane branch tracking.",
  },
  {
    title: "Splits and vertical tabs",
    body: "Horizontal and vertical splits, drag-to-reorder tabs, keyboard navigation throughout.",
  },
  {
    title: "Editor, file tree, search",
    body: "Native lightweight editor, project file browser, and ripgrep-powered find-in-files.",
  },
  {
    title: "AI usage tracking",
    body: "Live token and cost panels for Claude Code, Codex, Cursor, Copilot, and more.",
  },
  {
    title: "Mobile companion",
    body: "Pair iOS or Android to control your Mac terminal sessions remotely.",
  },
  {
    title: "200+ themes",
    body: "Browse and search the full Ghostty catalogue from a built-in picker — this page uses them too.",
  },
];

export function Features() {
  return (
    <section className="mb-20">
      <h2 className="m-0 mb-1 text-[clamp(22px,2.6vw,28px)] font-semibold tracking-[-0.4px]">
        Built for the way you actually work
      </h2>
      <p className="m-0 mb-8 max-w-[620px] text-theme-fg-muted">
        A short tour. See the{" "}
        <a
          href="https://github.com/muxy-app/muxy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme-fg hover:underline"
        >
          README
        </a>{" "}
        for everything.
      </p>

      <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <h3 className="m-0 mb-1 text-[14px] font-semibold text-theme-fg">{f.title}</h3>
            <p className="m-0 text-[13px] leading-[1.55] text-theme-fg-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

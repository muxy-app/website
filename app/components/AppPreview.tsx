// Static HTML/CSS replica of the Muxy desktop app. No interactivity here —
// just markup that re-themes via CSS variables (see ThemeProvider).

import { ProjectSidebar } from "./preview/ProjectSidebar";
import { TopBar } from "./preview/TopBar";
import { Terminal } from "./preview/Terminal";
import { VcsPanel } from "./preview/VcsPanel";
import { BottomBar } from "./preview/BottomBar";

export function AppPreview() {
  return (
    <section className="mb-20 hidden md:block" aria-label="Muxy desktop app preview">
      <div
        className="flex min-h-[640px] overflow-hidden rounded-xl border border-theme-border-strong bg-theme-bg font-mono text-[12px] text-theme-fg"
      >
        <ProjectSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="flex min-h-0 flex-1">
            <Terminal />
            <div className="w-px bg-theme-border" />
            <VcsPanel />
          </div>
          <BottomBar />
        </div>
      </div>
    </section>
  );
}

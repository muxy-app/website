import { Folder, Layers } from "lucide-react";

export function BottomBar() {
  return (
    <div className="flex h-[26px] flex-shrink-0 items-center border-t border-theme-border font-sans text-[11px] text-theme-fg-muted">
      <Segment>
        <Folder size={11} strokeWidth={1.5} />
        ~/Projects/muxy-website/
      </Segment>
      <Segment last>
        <Layers size={11} strokeWidth={1.5} />
        muxy-website
      </Segment>
    </div>
  );
}

function Segment({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <span
      className={`inline-flex h-full items-center gap-1.5 px-3 ${last ? "" : "border-r border-theme-border"}`}
    >
      {children}
    </span>
  );
}

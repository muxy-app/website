// Static replica of the opencode TUI splash screen, themed via CSS variables.

"use client";

import Image from "next/image";
import { useThemeContext } from "../ThemeProvider";

export function Terminal() {
  const { active } = useThemeContext();
  // ThemeProvider already classifies background luminance for `data-theme-kind`.
  // Re-derive it inline so we can pick the right opencode wordmark variant —
  // the dark-bg logo uses darker fills that read as light on dark themes,
  // and vice versa for the light variant.
  const logoSrc = isLightTheme(active.background)
    ? "/assets/opencode-light.svg"
    : "/assets/opencode-dark.svg";

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-theme-bg font-mono text-[12.5px] leading-[1.5]">
      {/* Centered logo + prompt block */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="flex w-full max-w-[460px] flex-col items-center">
          <Image
            src={logoSrc}
            alt="opencode"
            width={240}
            height={43}
            className="mb-6 opacity-90"
            priority
          />

          <div className="relative w-full pl-[6px]">
            <span
              className="absolute left-0 w-[2px] bg-theme-accent"
              style={{ top: "0", bottom: "0" }}
            />
            <div className="rounded-sm bg-theme-surface-strong px-4 py-3">
              <div className="text-theme-fg-dim">
                <span>Ask anything... </span>
                <span>&ldquo;Fix broken tests&rdquo;</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-theme-fg-muted">
                <span style={{ color: "var(--accent)" }}>Build</span>
                <span className="text-theme-fg-dim">·</span>
                <span>GPT-5.5 OpenAI</span>
                <span className="text-theme-fg-dim">·</span>
                <span style={{ color: "var(--c3)" }}>xhigh</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex w-full justify-end gap-4 text-[11px] text-theme-fg-dim">
            <span>
              <span className="text-theme-fg-muted">tab</span> agents
            </span>
            <span>
              <span className="text-theme-fg-muted">ctrl+p</span> commands
            </span>
          </div>

          <div className="mt-10 self-start text-theme-fg-dim">
            <span style={{ color: "var(--c3)" }}>●</span>{" "}
            <span className="text-theme-fg-muted">Tip</span>{" "}
            <span>Permission </span>
            <span className="text-theme-fg-muted">doom_loop</span>
            <span> prevents infinite tool call loops</span>
          </div>
        </div>
      </div>

      {/* Status footer */}
      <div className="flex items-center justify-between px-6 pb-3 text-[11px] text-theme-fg-dim">
        <div className="inline-flex items-center gap-3">
          <span>
            ~/Projects/muxy-website
            <span className="text-theme-fg-muted">:main</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span style={{ color: "var(--c1)" }}>◉</span>
            <span>1 MCP</span>
            <span className="text-theme-fg-muted">/status</span>
          </span>
        </div>
        <span>1.14.48</span>
      </div>
    </div>
  );
}

function isLightTheme(bg: string): boolean {
  const v = bg.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) > 0.5;
}

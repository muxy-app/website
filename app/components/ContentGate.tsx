"use client";

import { useThemeContext } from "./ThemeProvider";

// Holds the page invisible until ThemeProvider has read the saved theme from
// localStorage. Renders an empty <div> with the theme background while we wait
// so the user just sees a solid color (no flash of the default-themed UI).
//
// First paint vs. reload tradeoff: we accept a tiny "no content yet" frame
// after mount in exchange for never showing the wrong colors on reload.
export function ContentGate({ children }: { children: React.ReactNode }) {
  const { hydrated } = useThemeContext();
  return (
    <div
      style={{
        opacity: hydrated ? 1 : 0,
        // Skip the fade-in if we hydrated synchronously; only animate when
        // hydration completes after the first frame (i.e. real navigations).
        transition: hydrated ? "opacity 0.12s ease" : undefined,
      }}
    >
      {children}
    </div>
  );
}

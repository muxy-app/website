import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ContentGate } from "./components/ContentGate";

export const metadata: Metadata = {
  title: "Muxy — A lightweight terminal multiplexer for Mac",
  description:
    "Muxy is a lightweight, memory-efficient terminal multiplexer for Mac built with SwiftUI and libghostty. Project-based workflow, split panes, built-in VCS, 200+ themes.",
  icons: {
    icon: [
      { url: "/assets/logo.svg", type: "image/svg+xml" },
      { url: "/assets/icon.png", type: "image/png" },
    ],
  },
};

// Synchronously apply the saved theme's CSS variables before React hydrates,
// so users don't see a flash of the default Muxy palette on reload.
// ThemeProvider persists the resolved variables to localStorage under
// muxy.website.themeVars; we just write them straight to <body>.
const themePreloadScript = `
(function(){
  try {
    var raw = localStorage.getItem("muxy.website.themeVars");
    if (!raw) return;
    var vars = JSON.parse(raw);
    if (!vars || typeof vars !== "object") return;
    var body = document.body;
    for (var name in vars) {
      if (Object.prototype.hasOwnProperty.call(vars, name)) {
        body.style.setProperty(name, vars[name]);
      }
    }
    var bg = vars["--bg"];
    if (bg) {
      var v = bg.replace("#","");
      var r = parseInt(v.slice(0,2),16)/255;
      var g = parseInt(v.slice(2,4),16)/255;
      var b = parseInt(v.slice(4,6),16)/255;
      var lin = function(c){ return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
      var lum = 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
      body.dataset.themeKind = lum > 0.5 ? "light" : "dark";
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning: the theme-preload script intentionally writes
          inline CSS vars + data-theme-kind onto <body> before React hydrates,
          so the client tree diverges from the SSR markup by design. */}
      <body
        className="font-sans text-[15px] leading-[1.55] antialiased"
        suppressHydrationWarning
      >
        <Script id="muxy-theme-preload" strategy="beforeInteractive">
          {themePreloadScript}
        </Script>
        <ThemeProvider>
          <ContentGate>{children}</ContentGate>
        </ThemeProvider>
      </body>
    </html>
  );
}

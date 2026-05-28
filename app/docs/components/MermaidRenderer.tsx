"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

export function MermaidRenderer() {
  useEffect(() => {
    let cancelled = false;

    async function render() {
      const isLight = document.body.dataset.themeKind === "light";
      mermaid.initialize({
        startOnLoad: false,
        theme: isLight ? "default" : "dark",
        securityLevel: "strict",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      });

      const nodes = Array.from(document.querySelectorAll<HTMLElement>(".mermaid-doc"));
      for (const [index, node] of nodes.entries()) {
        if (cancelled || node.dataset.rendered === "true") continue;
        const diagram = node.dataset.diagram || "";
        try {
          const { svg } = await mermaid.render(`muxy-doc-diagram-${Date.now()}-${index}`, diagram);
          node.innerHTML = svg;
          node.dataset.rendered = "true";
        } catch {
          node.dataset.rendered = "error";
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

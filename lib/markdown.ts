import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

export async function markdownToHtml(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMermaid)
    .use(remarkRewriteDocLinks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: ["heading-anchor"], ariaLabel: "Link to heading" },
      content: { type: "text", value: "#" },
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

function remarkMermaid() {
  return (tree: any) => {
    visit(tree, "code", (node) => {
      if (node.lang !== "mermaid") return;
      node.type = "html";
      node.value = `<div class="mermaid-doc" data-diagram="${escapeAttr(node.value)}"><pre>${escapeHtml(node.value)}</pre></div>`;
    });
  };
}

function remarkRewriteDocLinks() {
  return (tree: any) => {
    visit(tree, "link", (node) => {
      if (!node.url || /^(https?:|mailto:|#)/.test(node.url)) return;
      if (!/\.mdx?(#.*)?$/i.test(node.url)) return;

      const [path, hash] = node.url.split("#");
      const parts = path
        .replace(/\.mdx?$/i, "")
        .split("/")
        .filter(Boolean)
        .map((part: string) => part.replace(/^[0-9]+[-_]/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

      if (parts.at(-1) === "readme") parts.pop();
      node.url = `/docs${parts.length ? `/${parts.join("/")}` : ""}${hash ? `#${hash}` : ""}`;
    });
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

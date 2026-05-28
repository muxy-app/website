import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, ".content");
const docsDir = join(contentDir, "docs");
const ensureCache = process.argv.includes("--ensure-cache");

if (!existsSync(docsDir)) {
  if (ensureCache) {
    const result = spawnSync(process.execPath, [join(root, "scripts", "pull-docs.mjs")], {
      stdio: "inherit",
    });
    if (result.status !== 0) process.exit(result.status ?? 1);
  } else {
    throw new Error("Docs cache is missing. Run `npm run docs:pull` first.");
  }
}

const markdownFiles = walk(docsDir).filter((file) => /\.mdx?$/i.test(file));
const pages = markdownFiles.map(readPage).sort(comparePages);
const sidebar = buildSidebar(pages);
const search = pages.flatMap(buildSearchRecords);

mkdirSync(contentDir, { recursive: true });
writeFileSync(join(contentDir, "docs.generated.json"), JSON.stringify({ pages, sidebar }, null, 2));
writeFileSync(join(contentDir, "docs.search.json"), JSON.stringify(search, null, 2));
console.log(`Generated ${pages.length} docs pages and ${search.length} search records.`);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (entry.isFile()) return [full];
    return [];
  });
}

function readPage(file) {
  const sourcePath = relative(docsDir, file).split(sep).join("/");
  const parsed = matter(readFileSync(file, "utf8"));
  const slug = slugForSourcePath(sourcePath);
  const headings = extractHeadings(parsed.content);
  const title = String(parsed.data.title || headings.find((h) => h.depth === 1)?.text || titleFromPath(sourcePath));
  return {
    slug,
    href: `/docs${slug.length ? `/${slug.join("/")}` : ""}`,
    sourcePath,
    title,
    description: parsed.data.description ? String(parsed.data.description) : undefined,
    order: typeof parsed.data.order === "number" ? parsed.data.order : undefined,
    headings,
    rawMarkdown: parsed.content,
  };
}

function slugForSourcePath(sourcePath) {
  const parts = sourcePath.replace(/\.mdx?$/i, "").split("/");
  if (parts.at(-1)?.toLowerCase() === "readme") parts.pop();
  return parts.map(slugifyPathSegment).filter(Boolean);
}

function titleFromPath(sourcePath) {
  const name = basename(sourcePath, extname(sourcePath)).toLowerCase() === "readme"
    ? basename(dirname(sourcePath))
    : basename(sourcePath, extname(sourcePath));
  return name
    .replace(/^[0-9]+[-_]/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractHeadings(markdown) {
  const seen = new Map();
  return markdown.split(/\r?\n/).flatMap((line) => {
    const match = /^(#{1,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) return [];
    const text = stripInlineMarkdown(match[2]).trim();
    const base = slugify(text);
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return [{ depth: match[1].length, text, id: count ? `${base}-${count}` : base }];
  });
}

function buildSearchRecords(page) {
  const sections = [];
  let current = { heading: page.title, href: page.href, text: "" };
  for (const line of page.rawMarkdown.split(/\r?\n/)) {
    const heading = /^(#{1,3})\s+(.+?)\s*#*$/.exec(line);
    if (heading) {
      if (current.text.trim()) sections.push(current);
      const text = stripInlineMarkdown(heading[2]).trim();
      const id = page.headings.find((h) => h.text === text)?.id || slugify(text);
      current = { heading: text, href: `${page.href}#${id}`, text: "" };
    } else {
      current.text += `${line}\n`;
    }
  }
  if (current.text.trim()) sections.push(current);
  return sections.map((section) => ({
    href: section.href,
    title: page.title,
    heading: section.heading,
    text: plainText(section.text).slice(0, 1200),
  }));
}

function buildSidebar(pages) {
  const rootNode = { title: "Docs", children: [], href: undefined, order: -1 };
  for (const page of pages) {
    let node = rootNode;
    page.slug.forEach((part, index) => {
      const isLeaf = index === page.slug.length - 1;
      let child = node.children.find((item) => item.segment === part);
      if (!child) {
        child = { segment: part, title: titleFromPath(part), children: [], order: page.order };
        node.children.push(child);
      }
      if (isLeaf) {
        child.title = page.title;
        child.href = page.href;
        child.order = page.order;
      }
      node = child;
    });
    if (page.slug.length === 0) {
      rootNode.href = page.href;
      rootNode.title = page.title;
      rootNode.order = page.order ?? -1;
    }
  }
  return sortSidebar(rootNode.children);
}

function sortSidebar(items) {
  return items
    .map((item) => ({
      title: item.title,
      href: item.href,
      children: item.children?.length ? sortSidebar(item.children) : undefined,
      order: item.order,
    }))
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.title.localeCompare(b.title))
    .map(({ order, ...item }) => item);
}

function comparePages(a, b) {
  return (a.order ?? 9999) - (b.order ?? 9999) || a.sourcePath.localeCompare(b.sourcePath);
}

function slugifyPathSegment(value) {
  return value.replace(/^[0-9]+[-_]/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function slugify(value) {
  return value.toLowerCase().replace(/[`*_~[\]()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function stripInlineMarkdown(value) {
  return value.replace(/[`*_~]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function plainText(value) {
  return stripInlineMarkdown(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>\-|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

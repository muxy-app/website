import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { docPages, docsSearch, docsSidebar, getDocPage, getNeighborDocs } from "@/lib/docs";
import { markdownToHtml } from "@/lib/markdown";
import { DocsSearch } from "../components/DocsSearch";
import { DocsSidebar } from "../components/DocsSidebar";
import { MermaidRenderer } from "../components/MermaidRenderer";

type Props = { params: Promise<{ slug?: string[] }> };

export function generateStaticParams() {
  return docPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = getDocPage(slug);
  if (!page) return {};
  return {
    title: `${page.title} — Muxy Docs`,
    description: page.description,
  };
}

export default async function DocsPage({ params }: Props) {
  const { slug = [] } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();

  const html = await markdownToHtml(page.rawMarkdown);
  const neighbors = getNeighborDocs(page);

  return (
    <main className="pb-20 pt-8">
      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="border-theme-border lg:border-r lg:pr-6">
          <DocsSearch records={docsSearch} />
          <DocsSidebar items={docsSidebar} currentHref={page.href} />
        </aside>

        <div className="min-w-0">
          <div className="mb-8 border-b border-theme-border pb-6">
            <h1 className="m-0 text-[clamp(30px,5vw,52px)] font-semibold leading-[1.03] tracking-[-1.4px] text-theme-fg">
              {page.title}
            </h1>
            {page.description ? <p className="m-0 mt-3 max-w-[720px] text-theme-fg-muted">{page.description}</p> : null}
          </div>
          <article className="docs-markdown" dangerouslySetInnerHTML={{ __html: html }} />
          <MermaidRenderer />
          <nav className="mt-12 grid gap-3 border-t border-theme-border pt-6 sm:grid-cols-2">
            {neighbors.previous ? (
              <Link className="rounded-xl border border-theme-border bg-theme-surface p-4 hover:bg-theme-hover hover:no-underline" href={neighbors.previous.href}>
                <div className="text-[12px] text-theme-fg-dim">Previous</div>
                <div className="text-[14px] font-medium text-theme-fg">{neighbors.previous.title}</div>
              </Link>
            ) : <div />}
            {neighbors.next ? (
              <Link className="rounded-xl border border-theme-border bg-theme-surface p-4 text-right hover:bg-theme-hover hover:no-underline" href={neighbors.next.href}>
                <div className="text-[12px] text-theme-fg-dim">Next</div>
                <div className="text-[14px] font-medium text-theme-fg">{neighbors.next.title}</div>
              </Link>
            ) : null}
          </nav>
        </div>

      </div>
    </main>
  );
}

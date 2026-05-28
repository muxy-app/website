import docsData from "@/.content/docs.generated.json";
import searchData from "@/.content/docs.search.json";

export type DocHeading = {
  depth: number;
  text: string;
  id: string;
};

export type DocPage = {
  slug: string[];
  href: string;
  sourcePath: string;
  title: string;
  description?: string;
  order?: number;
  headings: DocHeading[];
  rawMarkdown: string;
};

export type SidebarItem = {
  title: string;
  href?: string;
  children?: SidebarItem[];
};

export type SearchRecord = {
  href: string;
  title: string;
  heading: string;
  text: string;
};

export const docPages = docsData.pages as DocPage[];
export const docsSidebar = docsData.sidebar as SidebarItem[];
export const docsSearch = searchData as SearchRecord[];

export function getDocPage(slug: string[] = []) {
  return docPages.find((page) => page.slug.join("/") === slug.join("/"));
}

export function getNeighborDocs(page: DocPage) {
  const index = docPages.findIndex((item) => item.href === page.href);
  return {
    previous: index > 0 ? docPages[index - 1] : undefined,
    next: index >= 0 && index < docPages.length - 1 ? docPages[index + 1] : undefined,
  };
}

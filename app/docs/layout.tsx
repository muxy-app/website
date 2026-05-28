import { Topline } from "../components/Topline";
import { SiteFooter } from "../components/SiteFooter";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
      <Topline />
      {children}
      <SiteFooter />
    </div>
  );
}

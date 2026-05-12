import { Topline } from "./components/Topline";
import { Hero } from "./components/Hero";
import { AppPreview } from "./components/AppPreview";
import { MobilePreview } from "./components/MobilePreview";
import { Features } from "./components/Features";
import { Install } from "./components/Install";
import { SiteFooter } from "./components/SiteFooter";

export default function Page() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
      <Topline />
      <Hero />
      <AppPreview />
      <MobilePreview />
      <Features />
      <Install />
      <SiteFooter />
    </div>
  );
}

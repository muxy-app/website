import { Topline } from "./components/Topline";
import { Hero } from "./components/Hero";
import { AppPreview } from "./components/AppPreview";
import { MobilePreview, MobileCTAs } from "./components/MobilePreview";
import { ScaledFit } from "./components/ScaledFit";
import { Features } from "./components/Features";
import { Install } from "./components/Install";
import { SiteFooter } from "./components/SiteFooter";

export default function Page() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
      <Topline />
      <Hero />
      <section className="mb-20" aria-label="Muxy desktop app preview">
        <ScaledFit naturalWidth={1180}>
          <AppPreview />
        </ScaledFit>
      </section>
      <Features />
      <section id="mobile" className="mb-20 scroll-mt-16" aria-label="Muxy mobile remote">
        <h2 className="m-0 mb-1 text-[clamp(22px,2.6vw,28px)] font-semibold tracking-[-0.4px]">
          Your terminal, in your pocket
        </h2>
        <p className="m-0 mb-8 max-w-[620px] text-theme-fg-muted">
          Pair the iOS or Android remote with your Mac to check sessions,
          read output, and tap through prompts from anywhere.
        </p>
        <MobilePreview />
        <MobileCTAs />
      </section>
      <Install />
      <SiteFooter />
    </div>
  );
}

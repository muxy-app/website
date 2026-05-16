import type { Metadata } from "next";
import { Topline } from "../components/Topline";
import { SiteFooter } from "../components/SiteFooter";
import { BetaSignupForm } from "../components/BetaSignupForm";

export const metadata: Metadata = {
  title: "Muxy iOS beta — Apply to test",
  description:
    "Apply to join the Muxy iOS beta. 50 testers get early access to the iPhone remote via TestFlight.",
};

export default function IosBetaPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
      <Topline />

      <section className="mx-auto max-w-[640px] pt-10 pb-20">
        <p className="m-0 mb-3 text-[13px] uppercase tracking-wider text-theme-fg-dim">
          iOS beta
        </p>
        <h1 className="m-0 mb-4 text-[clamp(32px,5vw,48px)] font-semibold leading-[1.1] tracking-[-1px] text-theme-fg">
          Apply to test Muxy on iOS
        </h1>
        <p className="m-0 mb-8 text-[15px] leading-[1.6] text-theme-fg-muted">
          We&rsquo;re inviting up to <strong className="text-theme-fg">50 testers</strong>{" "}
          to try the iPhone remote ahead of the public release. Check sessions,
          read terminal output, and tap through prompts on your Mac from
          anywhere. Accepted testers get a TestFlight invite within a few days.
        </p>

        <BetaSignupForm />

        <p className="mt-8 text-[12px] text-theme-fg-dim">
          By applying you agree to share build crash reports and usage feedback
          with the Muxy team during the beta period.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

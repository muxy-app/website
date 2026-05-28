import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-theme-border py-6 pb-10 text-[12.5px] text-theme-fg-muted">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 font-medium text-theme-fg">
          <Image src="/assets/logo.svg" alt="" width={20} height={20} />
          <span>Muxy</span>
        </div>
        <nav className="inline-flex gap-4">
          <FooterLink href="https://github.com/muxy-app/muxy">GitHub</FooterLink>
          <FooterLink href="https://github.com/muxy-app/mobile">Mobile</FooterLink>
          <FooterLink href="https://discord.gg/4eMXAmJQ2n">Discord</FooterLink>
          <FooterLink href="https://github.com/muxy-app/muxy/blob/main/LICENSE">MIT License</FooterLink>
        </nav>
      </div>
      <p className="mt-3 text-[11.5px] text-theme-fg-dim">
        Built with libghostty. Themes courtesy of the Ghostty community.
      </p>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-theme-fg-muted hover:text-theme-fg">
      {children}
    </a>
  );
}

import Image from "next/image";
import { ThemePicker } from "./ThemePicker";
import { GitHubStars } from "./GitHubStars";

const DISCORD_URL = "https://discord.gg/4eMXAmJQ2n";

export function Topline() {
  return (
    <header className="flex items-center gap-3 pt-6 pb-3.5">
      <a href="/" className="inline-flex items-center gap-2.5 font-semibold text-[15px] text-theme-fg hover:no-underline">
        <Image src="/assets/logo.svg" alt="" width={22} height={22} />
        <span>Muxy</span>
      </a>
      <nav className="ml-auto inline-flex items-center gap-1">
        <GitHubStars />
        <ToplineLink href={DISCORD_URL} label="Discord">
          <DiscordIcon />
        </ToplineLink>
        <ThemePicker />
      </nav>
    </header>
  );
}

function ToplineLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-theme-fg-muted hover:bg-theme-hover hover:text-theme-fg hover:no-underline"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.07.07 0 0 0-.075.035c-.21.375-.45.865-.617 1.25a18.27 18.27 0 0 0-5.487 0c-.167-.39-.41-.875-.62-1.25a.077.077 0 0 0-.075-.035 19.74 19.74 0 0 0-4.885 1.515.07.07 0 0 0-.032.028C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.349-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      />
    </svg>
  );
}


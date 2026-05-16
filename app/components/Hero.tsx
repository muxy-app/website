export function Hero() {
  return (
    <section className="max-w-[720px] pt-10 pb-9">
      <h1 className="font-mono font-semibold tracking-[-2px] text-[clamp(48px,7vw,78px)] leading-[1.05] m-0 mb-3.5 text-theme-fg">
        Muxy
      </h1>
      <p className="text-[clamp(15px,1.6vw,18px)] leading-[1.5] text-theme-fg-muted mb-6">
        A lightweight, memory-efficient terminal multiplexer for Mac.
        <br />
        Built with SwiftUI and libghostty.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <a
          href="https://github.com/muxy-app/muxy/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-theme-accent px-3 py-1.5 text-[13px] text-theme-accent-fg hover:no-underline hover:brightness-110 active:translate-y-px"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7.5 1v8.69l-2.97-2.97a.75.75 0 1 0-1.06 1.06l4.25 4.25a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0-1.06-1.06L8.5 9.69V1a.5.5 0 0 0-1 0Z M2.5 13a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11Z"
            />
          </svg>
          Download for Mac
        </a>
        <a
          href="#mobile"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-theme-fg-muted hover:text-theme-fg hover:no-underline"
        >
          Mobile remote (iOS · Android) →
        </a>
      </div>
    </section>
  );
}

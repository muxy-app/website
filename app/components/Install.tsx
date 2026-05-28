export function Install() {
  return (
    <section className="mb-20">
      <h2 className="m-0 mb-4 text-[clamp(22px,2.6vw,28px)] font-semibold tracking-[-0.4px]">
        Install
      </h2>

      <a
        href="https://github.com/muxy-app/muxy/releases/latest"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-theme-accent px-4 py-2 text-[14px] font-medium text-theme-accent-fg hover:no-underline hover:brightness-110"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.5 1v8.69l-2.97-2.97a.75.75 0 1 0-1.06 1.06l4.25 4.25a.75.75 0 0 0 1.06 0l4.25-4.25a.75.75 0 0 0-1.06-1.06L8.5 9.69V1a.5.5 0 0 0-1 0Z M2.5 13a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11Z"
          />
        </svg>
        Download for Mac
      </a>

      <p className="mt-4 text-[13px] text-theme-fg-muted">
        Or install via Homebrew:{" "}
        <code className="rounded bg-theme-surface px-1.5 py-0.5 font-mono text-[12.5px] text-theme-fg">
          brew install --cask muxy-app/tap/muxy
        </code>
        . The{" "}
        <a
          href="https://github.com/muxy-app/mobile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme-fg hover:underline"
        >
          mobile remote
        </a>{" "}
        is on iOS and Android.
      </p>
    </section>
  );
}

"use client";

// Posts beta-test applications to a Google Apps Script Web App, which appends
// them to a Google Sheet (we have no backend of our own). The endpoint URL is
// configured via NEXT_PUBLIC_BETA_SIGNUP_URL; see app/ios-beta/page.tsx for the
// matching Apps Script.
//
// Request: POST text/plain with a JSON body. We use text/plain rather than
// application/json so the browser skips the CORS preflight that Apps Script
// Web Apps don't answer correctly. The Apps Script parses the raw body.
//
// Response: { ok: boolean, count: number, capacity: number, message?: string }.

import { useEffect, useState } from "react";

const CAPACITY = 50;
const ENDPOINT = process.env.NEXT_PUBLIC_BETA_SIGNUP_URL ?? "";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; spot: number | null }
  | { kind: "error"; message: string }
  | { kind: "full" };

type CountResponse = {
  ok: boolean;
  count: number;
  capacity: number;
};

type SubmitResponse = CountResponse & {
  message?: string;
  duplicate?: boolean;
};

export function BetaSignupForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [count, setCount] = useState<number | null>(null);

  // Best-effort initial count. If the endpoint is unreachable or unconfigured
  // we just leave the indicator empty — the form still submits.
  useEffect(() => {
    if (!ENDPOINT) return;
    let cancelled = false;
    fetch(ENDPOINT, { method: "GET" })
      .then((r) => r.json() as Promise<CountResponse>)
      .then((data) => {
        if (cancelled || !data?.ok) return;
        setCount(data.count);
        if (data.count >= (data.capacity ?? CAPACITY)) {
          setStatus({ kind: "full" });
        }
      })
      .catch(() => {
        // Silent: the form remains usable, we just don't show a counter.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users won't fill a hidden field.
    if ((data.get("company") as string)?.length) {
      setStatus({ kind: "success", spot: null });
      return;
    }

    const payload = {
      name: (data.get("name") as string)?.trim() ?? "",
      email: (data.get("email") as string)?.trim() ?? "",
      device: (data.get("device") as string)?.trim() ?? "",
      iosVersion: (data.get("iosVersion") as string)?.trim() ?? "",
      usage: (data.get("usage") as string)?.trim() ?? "",
      submittedAt: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    if (!payload.email || !payload.name) {
      setStatus({ kind: "error", message: "Name and email are required." });
      return;
    }

    if (!ENDPOINT) {
      setStatus({
        kind: "error",
        message:
          "Beta signup endpoint isn't configured. Set NEXT_PUBLIC_BETA_SIGNUP_URL and redeploy.",
      });
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        // text/plain avoids the CORS preflight that Apps Script Web Apps don't
        // handle. The script reads e.postData.contents as raw JSON.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as SubmitResponse;
      if (!body?.ok) {
        if (body?.message === "full") {
          setCount(body.count);
          setStatus({ kind: "full" });
          return;
        }
        setStatus({
          kind: "error",
          message: body?.message || "Something went wrong. Please try again.",
        });
        return;
      }
      setCount(body.count);
      setStatus({ kind: "success", spot: body.count });
      form.reset();
    } catch (err) {
      setStatus({
        kind: "error",
        message: "Couldn't reach the signup server. Please try again.",
      });
    }
  }

  const remaining =
    count == null ? null : Math.max(CAPACITY - count, 0);

  if (status.kind === "success") {
    return (
      <div className="rounded-xl border border-theme-border bg-theme-surface p-6">
        <h2 className="m-0 mb-2 text-[18px] font-semibold text-theme-fg">
          You&rsquo;re on the list
        </h2>
        <p className="m-0 text-[14px] text-theme-fg-muted">
          {status.spot != null
            ? `You're tester #${status.spot} of ${CAPACITY}. `
            : ""}
          We&rsquo;ll send a TestFlight invite to the email you provided as
          soon as a slot opens up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <SpotsIndicator capacity={CAPACITY} remaining={remaining} full={status.kind === "full"} />

      <Field
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
        disabled={status.kind === "full"}
      />
      <Field
        label="Apple ID email"
        hint="The email tied to your App Store account — we send TestFlight invites here."
        name="email"
        type="email"
        autoComplete="email"
        required
        disabled={status.kind === "full"}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Device"
          placeholder="iPhone 15 Pro"
          name="device"
          type="text"
          disabled={status.kind === "full"}
        />
        <Field
          label="iOS version"
          placeholder="17.5"
          name="iosVersion"
          type="text"
          disabled={status.kind === "full"}
        />
      </div>
      <Field
        label="How would you use Muxy mobile?"
        hint="Optional — helps us prioritize testers."
        name="usage"
        type="textarea"
        disabled={status.kind === "full"}
      />

      {/* Honeypot — hidden from sighted users and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === "error" && (
        <p className="m-0 text-[13px]" style={{ color: "var(--c1)" }}>
          {status.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status.kind === "submitting" || status.kind === "full"}
          className="inline-flex items-center gap-1.5 rounded-md bg-theme-accent px-4 py-2 text-[14px] font-medium text-theme-accent-fg hover:no-underline hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0"
        >
          {status.kind === "submitting"
            ? "Sending…"
            : status.kind === "full"
              ? "Beta is full"
              : "Apply for beta"}
        </button>
        <p className="m-0 text-[12px] text-theme-fg-dim">
          We&rsquo;ll only email you about the beta.
        </p>
      </div>
    </form>
  );
}

function SpotsIndicator({
  capacity,
  remaining,
  full,
}: {
  capacity: number;
  remaining: number | null;
  full: boolean;
}) {
  const taken = remaining == null ? null : capacity - remaining;
  const pct =
    taken == null ? 0 : Math.max(0, Math.min(100, (taken / capacity) * 100));

  return (
    <div className="rounded-xl border border-theme-border bg-theme-surface px-4 py-3">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="font-medium text-theme-fg">
          {full
            ? "Beta is full"
            : remaining == null
              ? `Limited to ${capacity} testers`
              : `${remaining} of ${capacity} spots left`}
        </span>
        {taken != null && (
          <span className="text-theme-fg-dim">{taken}/{capacity} taken</span>
        )}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-theme-surface-strong">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${pct}%`,
            background: full ? "var(--c1)" : "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  name,
  type,
  placeholder,
  autoComplete,
  required,
  disabled,
}: {
  label: string;
  hint?: string;
  name: string;
  type: "text" | "email" | "textarea";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const inputClass =
    "w-full rounded-md border border-theme-border bg-theme-bg px-3 py-2 text-[14px] text-theme-fg placeholder:text-theme-fg-dim focus:border-theme-border-strong focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-theme-fg">
        {label}
        {required && (
          <span className="ml-1 text-theme-fg-dim" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {type === "textarea" ? (
        <textarea
          name={name}
          rows={3}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClass}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          className={inputClass}
        />
      )}
      {hint && <span className="text-[12px] text-theme-fg-dim">{hint}</span>}
    </label>
  );
}

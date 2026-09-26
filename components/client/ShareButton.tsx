"use client";

import { useState } from "react";

/** Shares a page with the Web Share API, or copies its link where sharing isn't available. */
export function ShareButton({
  url,
  title,
  label,
  copiedLabel,
  className = "",
}: {
  url: string;
  title: string;
  label: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // The person closed the share sheet: nothing to do.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <>
      <button type="button" onClick={share} className={className}>
        {copied ? copiedLabel : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}

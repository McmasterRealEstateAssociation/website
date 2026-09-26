"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

/** The small-screen navigation: a disclosure button and a full-width panel. */
export function MobileMenu({
  links,
  cta,
  openLabel,
  closeLabel,
  navLabel,
}: {
  links: readonly { label: string; href: string }[];
  cta: { label: string; href: string };
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when the route changes (derived from state, no effect needed).
  const isOpen = open && openedOn === pathname;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          setOpen(!isOpen);
          setOpenedOn(pathname);
        }}
        className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-[2px] border-[1.5px] border-white/60 px-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:border-gold hover:text-gold"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          {isOpen ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M2 5h16M2 10h16M2 15h16" />}
        </svg>
        {isOpen ? closeLabel : openLabel}
      </button>

      <nav
        id={panelId}
        aria-label={navLabel}
        hidden={!isOpen}
        className="absolute inset-x-0 top-full z-40 border-t border-gold/35 bg-maroon shadow-[0_12px_24px_rgba(42,14,28,0.35)]"
      >
        <ul className="mx-auto max-w-content px-5 py-3 sm:px-8">
          {links.map((link) => (
            <li key={link.href} className="border-b border-white/15">
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-13 items-center text-lg font-semibold text-white hover:text-gold aria-[current=page]:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="py-5">
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center rounded-[2px] bg-gold px-6 font-semibold text-black hover:bg-[#ffd07e]"
            >
              {cta.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

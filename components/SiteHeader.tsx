import Link from "next/link";
import { copy, site } from "@/content/site";
import { Mark } from "./brand/Mark";
import { MobileMenu } from "./client/MobileMenu";
import { NavLinks } from "./client/NavLinks";

export function SiteHeader() {
  return (
    <header className="relative z-30 bg-maroon text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-[2px] focus:bg-gold focus:px-4 focus:py-2.5 focus:font-semibold focus:text-black"
      >
        {copy.a11y.skip}
      </a>
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:py-4">
        <Link href="/" className="flex min-h-11 items-center gap-3 text-white hover:text-gold">
          <Mark className="h-11 w-11 shrink-0 text-gold sm:h-12 sm:w-12" />
          <span className="max-w-[12.5rem] font-display text-[0.9375rem] font-semibold leading-tight tracking-[0.02em] sm:max-w-none sm:text-base">
            {site.name}
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <NavLinks links={copy.nav} label={copy.a11y.mainNav} />
          <a
            href={site.memberFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-[2px] bg-gold px-5 text-[0.9375rem] font-semibold text-black transition-colors hover:bg-[#ffd07e]"
          >
            {copy.memberButton}
            <span className="sr-only"> {copy.a11y.newTab}</span>
          </a>
        </div>

        <MobileMenu
          links={copy.nav}
          cta={{ label: copy.memberButton, href: site.memberFormUrl }}
          openLabel={copy.a11y.menuOpen}
          closeLabel={copy.a11y.menuClose}
          navLabel={copy.a11y.mainNav}
        />
      </div>
      <div aria-hidden="true" className="mx-auto max-w-content px-5 sm:px-8">
        <div className="h-px bg-gold/30" />
      </div>
    </header>
  );
}

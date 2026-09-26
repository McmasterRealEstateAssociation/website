import Link from "next/link";
import { copy, site } from "@/content/site";
import { Mark } from "./brand/Mark";
import { BUILD_TIME } from "@/lib/build-time";

export function SiteFooter() {
  const year = new Date(BUILD_TIME).getFullYear();
  return (
    <footer className="bg-maroon-deep text-white">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-md items-start gap-4">
            <Mark className="h-16 w-16 shrink-0 text-gold" />
            <div>
              <p className="font-display text-lg font-semibold leading-snug">{site.name}</p>
              <p className="mt-1.5 text-small text-white/85">{site.footerLine}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:gap-x-16">
            <nav aria-label={copy.a11y.footerNav}>
              <ul>
                {copy.nav.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-11 items-center font-medium hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ul>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium hover:text-gold">
                  {copy.footer.social.instagram}
                  <span className="sr-only"> {copy.a11y.newTab}</span>
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium hover:text-gold">
                  {copy.footer.social.linkedin}
                  <span className="sr-only"> {copy.a11y.newTab}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center font-medium hover:text-gold">
                  {copy.footer.social.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-small text-white/75">
          <p>
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mark } from "@/components/brand/Mark";
import { RecruitingGate, TimeGate } from "@/components/client/TimeGate";
import { copy, recruiting, site } from "@/content/site";
import { formatDayMonth } from "@/lib/dates";
import { eventDateShort, eventPath, upcomingEvents } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { effectiveRecruitingStatus } from "@/lib/recruiting";
import { fill } from "@/lib/text";
import { BUILD_TIME } from "@/lib/build-time";

export const metadata: Metadata = pageMetadata({
  title: copy.links.title,
  description: copy.links.description,
  path: "/links",
});

const base =
  "flex min-h-14 w-full items-center justify-center rounded-[2px] px-5 py-3.5 text-center font-semibold leading-snug transition-colors duration-150";
const styles = {
  primary: `${base} bg-gold text-black hover:bg-[#ffd07e]`,
  secondary: `${base} border-[1.5px] border-white/60 text-white hover:border-gold hover:text-gold`,
};

function LinkButton({ href, primary, children }: { href: string; primary?: boolean; children: ReactNode }) {
  const cls = primary ? styles.primary : styles.secondary;
  if (/^https?:/.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <span className="sr-only"> {copy.a11y.newTab}</span>
      </a>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export default function LinksPage() {
  const next = upcomingEvents(BUILD_TIME)[0];
  const opensOn = formatDayMonth(recruiting.opensOn);

  return (
    <main id="main" className="min-h-dvh bg-maroon text-white">
      <div className="mx-auto flex w-full max-w-[27.5rem] flex-col items-center px-5 pb-14 pt-12">
        <Mark className="h-28 w-28 text-gold" />
        <h1 className="mt-6 text-center font-display text-[1.625rem] font-semibold leading-tight">{site.name}</h1>
        <p className="mt-3 text-center text-white/90">{site.tagline}</p>

        <ul className="mt-10 w-full space-y-3.5">
          {next && (
            <TimeGate until={next.end ?? next.start ?? ""} visibleAtBuild>
              <li>
                <LinkButton href={eventPath(next)} primary>
                  {fill(copy.links.nextEvent, { title: next.title, date: eventDateShort(next) })}
                </LinkButton>
              </li>
            </TimeGate>
          )}
          <li>
            <LinkButton href={site.memberFormUrl} primary={!next}>
              {copy.links.member}
            </LinkButton>
          </li>
          <RecruitingGate
            recruiting={recruiting}
            statusAtBuild={effectiveRecruitingStatus(new Date(BUILD_TIME))}
            variants={{
              open: (
                <li>
                  <LinkButton href="/team">{copy.links.applyTeam}</LinkButton>
                </li>
              ),
              "opening-soon": (
                <li>
                  <LinkButton href="/team">{fill(copy.links.teamOpens, { date: opensOn })}</LinkButton>
                </li>
              ),
            }}
          />
          <li>
            <LinkButton href="/speak">{copy.links.speak}</LinkButton>
          </li>
          <li>
            <LinkButton href={site.linkedin}>{copy.links.linkedin}</LinkButton>
          </li>
          <li>
            <LinkButton href={`mailto:${site.email}`}>{copy.links.email}</LinkButton>
          </li>
          <li>
            <LinkButton href="/">{copy.links.website}</LinkButton>
          </li>
        </ul>

        <p className="mt-12 text-center text-small text-white/75">{site.footerLine}</p>
      </div>
    </main>
  );
}

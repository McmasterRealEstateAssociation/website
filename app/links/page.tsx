import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mark } from "@/components/brand/Mark";
import { RecruitingGate, TimeGate } from "@/components/client/TimeGate";
import { PersonRing } from "@/components/PersonRing";
import { copy, recruiting, site, type SiteEvent } from "@/content/site";
import { formatDayMonth } from "@/lib/dates";
import { eventDateNoYear, eventPath, upcomingEvents } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { effectiveRecruitingStatus } from "@/lib/recruiting";
import { fill, noOrphan } from "@/lib/text";
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

/** The next event as a card: the speaker in a gold ring, then the event's title and date. */
function NextEventCard({ event }: { event: SiteEvent }) {
  const speaker = event.speakers[0];
  return (
    <Link
      href={eventPath(event)}
      className="flex items-center gap-4 rounded-[2px] border-[1.5px] border-gold/60 bg-maroon-deep p-4 transition-colors duration-150 hover:border-gold"
    >
      {speaker && <PersonRing name={speaker.name} photo={speaker.photo} size={80} tone="maroon" />}
      <div className="min-w-0">
        <p className="text-small font-semibold text-gold">{copy.links.nextEvent}</p>
        <p className="mt-1 font-display text-[1.3125rem] font-semibold leading-tight">{noOrphan(event.title)}</p>
        <p className="mt-1.5 text-small text-white/85">{eventDateNoYear(event)}</p>
      </div>
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
                <NextEventCard event={next} />
              </li>
            </TimeGate>
          )}
          <li>
            <LinkButton href={site.memberFormUrl} primary={!next}>
              {copy.links.member}
            </LinkButton>
          </li>
          {recruiting.status !== "closed" && (
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
          )}
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

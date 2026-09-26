import type { Metadata } from "next";
import { HeroDrawing } from "@/components/brand/HeroDrawing";
import { RecruitingGate, TimeGate } from "@/components/client/TimeGate";
import { NextEventFeature, PastEventRow } from "@/components/events";
import { InstagramText } from "@/components/InstagramText";
import { JsonLd } from "@/components/JsonLd";
import { PersonRing } from "@/components/PersonRing";
import { ButtonLink, Container, Rule, Section } from "@/components/ui";
import { copy, recruiting, site, stats, team } from "@/content/site";
import { eventPath, pastEvents, upcomingEvents } from "@/lib/events";
import { baseOpenGraph } from "@/lib/metadata";
import { effectiveRecruitingStatus } from "@/lib/recruiting";
import { BUILD_TIME } from "@/lib/build-time";

export const metadata: Metadata = {
  title: { absolute: copy.home.title },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, title: copy.home.title, description: site.description, url: "/" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  logo: `${site.url}/brand/mrea-logo.png`,
  email: site.email,
  sameAs: [site.instagram, site.linkedin],
  location: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.venue.locality,
      addressRegion: site.venue.region,
      addressCountry: site.venue.country,
    },
  },
};

export default function HomePage() {
  const now = BUILD_TIME;
  const next = upcomingEvents(now)[0];
  const past = pastEvents(now);
  const recruitingAtBuild = effectiveRecruitingStatus(new Date(now));
  const activeTeam = team.filter((m) => m.status === "active");

  const memberButtons = (
    <>
      <ButtonLink href={site.memberFormUrl} variant="gold">
        {copy.memberButton}
      </ButtonLink>
      <ButtonLink href="/events" variant="outline-light">
        {copy.home.ctaSeeEvents}
      </ButtonLink>
    </>
  );

  const announcedSoon = (
    <p className="max-w-prose text-lead">
      <InstagramText text={copy.events.noneUpcoming} linkClassName="text-maroon" />
    </p>
  );

  return (
    <>
      <JsonLd data={organizationJsonLd} />

      {/* Hero: text, then the elevation drawing standing on the section's bottom edge. */}
      <section className="relative overflow-hidden bg-maroon text-white">
        <Container className="relative z-10 pb-12 pt-12 sm:pt-16 lg:pb-40 lg:pt-24">
          <div className="lg:max-w-[46%]">
            <h1 className="font-display text-display font-semibold">{site.name}</h1>
            <Rule className="mt-7" />
            <p className="mt-6 max-w-[34rem] text-lead font-medium">{site.tagline}</p>
            <p className="mt-4 max-w-[34rem] text-white/85">{copy.home.heroSupport}</p>
            <p className="mt-4 text-small font-semibold text-gold">{copy.home.heroLocation}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {next ? (
                <TimeGate until={next.end ?? next.start ?? ""} visibleAtBuild fallback={memberButtons}>
                  <ButtonLink href={eventPath(next)} variant="gold">
                    {copy.home.ctaTicket}
                  </ButtonLink>
                  <ButtonLink href={site.memberFormUrl} variant="outline-light">
                    {copy.memberButton}
                  </ButtonLink>
                </TimeGate>
              ) : (
                memberButtons
              )}
            </div>
          </div>
        </Container>
        <div className="px-5 sm:px-8 lg:absolute lg:bottom-0 lg:right-0 lg:w-[54%] lg:max-w-[900px] lg:px-0 lg:pr-[max(2rem,calc((100vw-1100px)/2-4rem))]">
          <HeroDrawing className="block w-full" />
        </div>
      </section>

      {/* Next event */}
      <Section tone="white" aria-labelledby="next-event" className={next ? "" : "!py-14 sm:!py-16"}>
        <h2 id="next-event" className="font-display text-h2 text-maroon">
          {copy.home.nextEventHeading}
        </h2>
        <div className={next ? "mt-10" : "mt-4"}>
          {next ? (
            <TimeGate until={next.end ?? next.start ?? ""} visibleAtBuild fallback={announcedSoon}>
              <NextEventFeature event={next} />
            </TimeGate>
          ) : (
            announcedSoon
          )}
        </div>
      </Section>

      {/* Three things */}
      <Section tone="maroon" aria-labelledby="three-things">
        <h2 id="three-things" className="max-w-2xl font-display text-h2">
          {copy.home.threeThingsHeading}
        </h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-10">
          {copy.home.threeThings.map((item) => (
            <li key={item.title} className="border-t border-gold/60 pt-6">
              <h3 className="text-h3 font-semibold text-gold">{item.title}</h3>
              <p className="mt-3 text-white/90">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Stats: only real, verified numbers; nothing renders while empty. */}
      {stats.length > 0 && (
        <Section tone="white">
          <dl className="grid gap-8 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-small text-grey">{s.label}</dt>
                <dd className="font-display text-h1 text-maroon">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* Every faculty + past events */}
      <Section tone="white" aria-labelledby="past-events">
        <div className="max-w-3xl">
          <h2 className="sr-only">{copy.home.everyFacultyHeading}</h2>
          <Rule tone="maroon" />
          <p className="mt-6 text-[clamp(1.375rem,1.15rem+1vw,1.875rem)] font-semibold leading-snug text-maroon">
            {copy.home.everyFaculty}
          </p>
        </div>
        {past.length > 0 && (
          <div className="mt-20 sm:mt-24">
            <h2 id="past-events" className="font-display text-h2 text-maroon">
              {copy.home.pastEventsHeading}
            </h2>
            <div className="mt-10 space-y-14">
              {past.map((event) => (
                <PastEventRow key={event.slug} event={event} />
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* For professionals */}
      <Section tone="maroon" aria-labelledby="professionals">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
          <div className="max-w-2xl">
            <h2 id="professionals" className="font-display text-h2">
              {copy.home.professionalsHeading}
            </h2>
            <p className="mt-5 text-lead text-white/90">{copy.home.professionalsText}</p>
          </div>
          <div>
            <ButtonLink href="/speak" variant="gold">
              {copy.home.professionalsButton}
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section tone="white" aria-labelledby="team">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h2 id="team" className="font-display text-h2 text-maroon">
            {copy.home.teamHeading}
          </h2>
          <RecruitingGate
            recruiting={recruiting}
            statusAtBuild={recruitingAtBuild}
            variants={{
              open: <RecruitingBadge />,
              "opening-soon": <RecruitingBadge />,
            }}
          />
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-8">
          {activeTeam.map((member) => (
            <li key={member.name} className="flex w-32 flex-col items-center text-center">
              <PersonRing name={member.name} photo={member.photo} size={88} />
              <span className="mt-3 text-small font-semibold leading-snug">{member.name}</span>
              <span className="text-label text-grey">{member.role}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/team" variant="outline-dark">
            {copy.home.teamButton}
          </ButtonLink>
        </div>
      </Section>

      {/* Join band */}
      <section className="bg-maroon text-white">
        <Container className="flex flex-col items-start gap-7 py-16 sm:py-20 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl font-display text-h2 font-semibold">{copy.home.joinBand}</p>
          <ButtonLink href={site.memberFormUrl} variant="gold" className="shrink-0">
            {copy.memberButton}
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}

function RecruitingBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-maroon px-3.5 py-1 text-small font-semibold text-maroon">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-maroon" />
      {copy.home.recruitingBadge}
    </span>
  );
}

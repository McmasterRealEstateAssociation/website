import type { Metadata } from "next";
import { TimeGate } from "@/components/client/TimeGate";
import { PastEventRow, UpcomingEventRow } from "@/components/events";
import { InstagramText } from "@/components/InstagramText";
import { Container, Section } from "@/components/ui";
import { copy, type SiteEvent } from "@/content/site";
import { endsAt, pastEvents, upcomingEvents } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { BUILD_TIME } from "@/lib/build-time";

export const metadata: Metadata = pageMetadata({
  title: copy.events.title,
  description: copy.events.description,
  path: "/events",
});

export default function EventsPage() {
  const now = BUILD_TIME;
  const upcoming = upcomingEvents(now);
  const past = pastEvents(now);
  const noneUpcoming = (
    <p className="max-w-prose text-lead">
      <InstagramText text={copy.events.noneUpcoming} linkClassName="text-maroon" />
    </p>
  );

  return (
    <>
      <section className="bg-maroon text-white">
        <Container className="pb-16 pt-12 sm:pb-20 sm:pt-16">
          <h1 className="font-display text-h1">{copy.events.title}</h1>
          <p className="mt-5 max-w-prose text-lead text-white/90">{copy.events.intro}</p>
        </Container>
      </section>

      <Section tone="white" aria-labelledby="upcoming">
        <h2 id="upcoming" className="font-display text-h2 text-maroon">
          {copy.events.upcomingHeading}
        </h2>
        <div className="mt-8 space-y-12">
          {upcoming.length === 0 ? (
            noneUpcoming
          ) : (
            <>
              {upcoming.map((event) => (
                <TimeGate key={event.slug} until={event.end ?? event.start ?? ""} visibleAtBuild>
                  <UpcomingEventRow event={event} />
                </TimeGate>
              ))}
              {/* After the last listed event ends, say the next one is coming. */}
              <TimeGate until={lastEnd(upcoming)} visibleAtBuild fallback={noneUpcoming}>
                {null}
              </TimeGate>
            </>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-h2 text-maroon">{copy.events.pastHeading}</h2>
            <div className="mt-10 space-y-16">
              {past.map((event) => (
                <PastEventRow key={event.slug} event={event} />
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

const lastEnd = (list: SiteEvent[]) => new Date(Math.max(...list.map(endsAt))).toISOString();

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/client/ShareButton";
import { TimeGate } from "@/components/client/TimeGate";
import { speakerLine } from "@/components/events";
import { JsonLd } from "@/components/JsonLd";
import { PersonRing } from "@/components/PersonRing";
import { SpecSheet } from "@/components/SpecSheet";
import { buttonClasses, ButtonLink, Container, Section, TextLink } from "@/components/ui";
import { copy, site, type SiteEvent } from "@/content/site";
import {
  endsAt,
  eventAgenda,
  eventDateLong,
  eventHighlights,
  eventPath,
  eventPlace,
  eventUrl,
  filmingNotice,
  getEvent,
  googleCalendarUrl,
  icsPath,
  isUpcoming,
  publicEvents,
  speakerNames,
  timeFact,
} from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { shortName } from "@/lib/text";
import { BUILD_TIME } from "@/lib/build-time";

export const dynamicParams = false;

export function generateStaticParams() {
  return publicEvents().map((event) => ({ slug: event.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  const who = speakerNames(event);
  const description = [
    `${event.format}${who ? ` with ${who}` : ""}, ${eventDateLong(event)}, at McMaster University.`,
    event.summary ?? event.recap?.summary ?? "",
  ]
    .join(" ")
    .trim();
  return pageMetadata({
    title: event.title,
    description: description.length > 300 ? `${description.slice(0, 297).trimEnd()}...` : description,
    path: eventPath(event),
  });
}

function eventJsonLd(event: SiteEvent) {
  const offerUrl = event.rsvpUrl || eventUrl(event);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.start,
    endDate: event.end,
    doorTime: event.doorsOpen,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: true,
    url: eventUrl(event),
    image: [`${eventUrl(event)}/opengraph-image`],
    location: {
      "@type": "Place",
      name: [event.location.room, site.venue.name].filter(Boolean).join(", "),
      address: {
        "@type": "PostalAddress",
        streetAddress: site.venue.streetAddress,
        addressLocality: site.venue.locality,
        addressRegion: site.venue.region,
        postalCode: site.venue.postalCode,
        addressCountry: site.venue.country,
      },
    },
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "CAD",
      availability: "https://schema.org/InStock",
      url: offerUrl,
    },
    organizer: { "@type": "Organization", name: site.name, alternateName: site.shortName, url: site.url },
    performer: event.speakers.map((s) => ({ "@type": "Person", name: shortName(s.name) })),
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const now = BUILD_TIME;
  const upcoming = isUpcoming(event, now);
  const highlights = eventHighlights(event);
  const agenda = eventAgenda(event);
  const time = timeFact(event);
  const google = googleCalendarUrl(event);
  const until = new Date(endsAt(event)).toISOString();
  const endedNote = <p className="mt-6 text-white/85">{copy.event.ended}</p>;

  return (
    <>
      {event.status === "announced" && <JsonLd data={eventJsonLd(event)} />}

      {/* Title band */}
      <section className="bg-maroon text-white">
        <Container className="pb-16 pt-12 sm:pb-20 sm:pt-16">
          <p className="text-small font-semibold text-gold">{event.format}</p>
          <h1 className="mt-3 max-w-4xl font-display text-h1">{event.title}</h1>
          {event.subtitle && <p className="mt-4 max-w-prose text-lead text-white/90">{event.subtitle}</p>}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            {upcoming && event.rsvpUrl && (
              <TimeGate until={until} visibleAtBuild fallback={endedNote}>
                <ButtonLink href={event.rsvpUrl} variant="gold">
                  {copy.event.rsvp}
                </ButtonLink>
              </TimeGate>
            )}
            <ShareButton
              url={eventUrl(event)}
              title={`${event.title} | ${site.name}`}
              label={copy.event.share}
              copiedLabel={copy.event.shareCopied}
              className={buttonClasses("outline-light")}
            />
          </div>
        </Container>
      </section>

      {/* Details */}
      <Section tone="white">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="max-w-prose">
            {(upcoming ? event.summary : event.recap?.summary ?? event.summary) && (
              <p className="text-lead">{upcoming ? event.summary : event.recap?.summary ?? event.summary}</p>
            )}

            {highlights.length > 0 && (
              <>
                <h2 className="mt-14 font-display text-h2 text-maroon">{copy.event.whatYouGet}</h2>
                <ul className="mt-6 space-y-3">
                  {highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.75em] h-px w-4 shrink-0 bg-maroon" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {agenda.length > 0 && (
              <>
                <h2 className="mt-14 font-display text-h2 text-maroon">{copy.event.agenda}</h2>
                <ol className="mt-6 border-t border-grey/25">
                  {agenda.map((a) => (
                    <li key={a.time} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-grey/25 py-3.5">
                      <span className="font-semibold text-maroon">{a.time}</span>
                      <span>{a.text}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {event.filmed && upcoming && (
              <p className="mt-10 border-l-2 border-maroon pl-4 text-small text-grey">{filmingNotice(event)}</p>
            )}
          </div>

          <aside aria-label={copy.event.detailsLabel}>
            <SpecSheet
              rows={[
                { label: "Date", value: eventDateLong(event) },
                ...(time ? [time] : []),
                { label: "Place", value: eventPlace(event) },
                { label: "Format", value: event.format },
                { label: "Price", value: copy.event.price },
              ]}
            />
            {upcoming && (google || event.end) && (
              <TimeGate until={until} visibleAtBuild>
                <ul className="mt-6 space-y-1">
                  {google && (
                    <li>
                      <TextLink href={google} className="inline-flex min-h-11 items-center font-semibold text-maroon">
                        {copy.event.addToGoogle}
                      </TextLink>
                    </li>
                  )}
                  <li>
                    <TextLink href={icsPath(event)} className="inline-flex min-h-11 items-center font-semibold text-maroon">
                      {copy.event.downloadIcs}
                    </TextLink>
                  </li>
                </ul>
              </TimeGate>
            )}
          </aside>
        </div>

        {/* Speakers */}
        {event.speakers.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-h2 text-maroon">
              {event.speakers.length > 1 ? copy.event.speakers : copy.event.speaker}
            </h2>
            <ul className="mt-8 grid gap-10 sm:grid-cols-2">
              {event.speakers.map((s) => (
                <li key={s.name} className="flex items-center gap-5">
                  <PersonRing name={s.name} photo={s.photo} size={112} />
                  <div>
                    <p className="text-h3 font-semibold text-maroon-ink">{shortName(s.name)}</p>
                    {speakerLine(s) && <p className="mt-1 text-small text-grey">{speakerLine(s)}</p>}
                    {s.instagram && (
                      <p className="mt-1.5 text-small">
                        <TextLink href={`https://www.instagram.com/${s.instagram}/`} className="font-semibold text-maroon">
                          @{s.instagram}
                        </TextLink>
                      </p>
                    )}
                    {s.bio && <p className="mt-3 max-w-prose">{s.bio}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recap photos */}
        {!upcoming && event.recap && event.recap.photos.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-h2 text-maroon">{copy.event.photos}</h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.recap.photos.map((photo, i) => (
                <li key={i} className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    placeholder="blur"
                    sizes={i === 0 ? "(min-width: 1024px) 700px, (min-width: 640px) 90vw, 100vw" : "(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw"}
                    className="aspect-[4/3] h-full w-full rounded-[2px] object-cover"
                  />
                </li>
              ))}
            </ul>
            {event.recap.takeaways && event.recap.takeaways.length > 0 && (
              <ul className="mt-10 max-w-prose space-y-3">
                {event.recap.takeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Section>
    </>
  );
}

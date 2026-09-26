import Image from "next/image";
import Link from "next/link";
import { copy, type SiteEvent } from "@/content/site";
import {
  coverPhoto,
  eventDateLong,
  eventHighlights,
  eventPath,
  eventPlace,
  speakerNames,
  timeFact,
} from "@/lib/events";
import { PersonRing } from "./PersonRing";
import { SpecSheet } from "./SpecSheet";
import { ButtonLink, TextLink } from "./ui";

/** The home page's next-event feature: speaker, key facts, top three highlights, one link. */
export function NextEventFeature({ event }: { event: SiteEvent }) {
  const speaker = event.speakers[0];
  const time = timeFact(event);
  return (
    <article className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-12">
      {speaker && <PersonRing name={speaker.name} photo={speaker.photo} size={148} />}
      <div>
        <p className="text-small font-semibold text-grey">{event.format}</p>
        <h3 className="mt-2 font-display text-h2 font-semibold text-maroon">
          <Link href={eventPath(event)} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {event.title}
          </Link>
        </h3>
        {event.subtitle && <p className="mt-2 text-lead">{event.subtitle}</p>}
        <SpecSheet
          className="mt-7 max-w-xl"
          rows={[
            { label: "Date", value: eventDateLong(event) },
            ...(time ? [time] : []),
            { label: "Place", value: eventPlace(event) },
          ]}
        />
        {eventHighlights(event).length > 0 && (
          <ul className="mt-7 max-w-prose space-y-2.5">
            {eventHighlights(event)
              .slice(0, 3)
              .map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-maroon" />
                  <span>{h}</span>
                </li>
              ))}
          </ul>
        )}
        <div className="mt-8">
          <ButtonLink href={eventPath(event)} variant="maroon">
            {copy.home.nextEventLink}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

/** A row in the past-events list: photo, date, title, speakers, link to the recap. */
export function PastEventRow({ event, headingLevel = 3 }: { event: SiteEvent; headingLevel?: 2 | 3 }) {
  const photo = coverPhoto(event);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-12">
      {photo && (
        <Link href={eventPath(event)} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-[2px]">
          <Image
            src={photo.src}
            alt=""
            placeholder="blur"
            sizes="(min-width: 1100px) 560px, (min-width: 768px) 50vw, 100vw"
            className="aspect-[3/2] h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </Link>
      )}
      <div>
        <p className="text-small font-semibold text-grey">{eventDateLong(event)}</p>
        <Heading className="mt-2 font-display text-h2 font-semibold text-maroon">{event.title}</Heading>
        {event.speakers.length > 0 && <p className="mt-3">{speakerNames(event)}</p>}
        <p className="mt-5">
          <TextLink href={eventPath(event)} className="font-semibold text-maroon">
            {copy.home.recapLink}
            <span className="sr-only">: {event.title}</span>
          </TextLink>
        </p>
      </div>
    </article>
  );
}

/** A compact listing for an upcoming event on the events page. */
export function UpcomingEventRow({ event }: { event: SiteEvent }) {
  const speaker = event.speakers[0];
  const time = timeFact(event);
  return (
    <article className="grid gap-6 border-t border-grey/25 pt-8 md:grid-cols-[auto_1fr] md:gap-10">
      {speaker && <PersonRing name={speaker.name} photo={speaker.photo} size={120} />}
      <div>
        <p className="text-small font-semibold text-grey">{event.format}</p>
        <h3 className="mt-2 font-display text-h2 font-semibold text-maroon">{event.title}</h3>
        {event.subtitle && <p className="mt-2 text-lead">{event.subtitle}</p>}
        <SpecSheet
          className="mt-6 max-w-xl"
          rows={[
            { label: "Date", value: eventDateLong(event) },
            ...(time ? [time] : []),
            { label: "Place", value: eventPlace(event) },
          ]}
        />
        <div className="mt-7">
          <ButtonLink href={eventPath(event)} variant="maroon">
            {copy.home.nextEventLink}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export const speakerLine = (s: SiteEvent["speakers"][number]) =>
  [s.title, s.org].filter(Boolean).join(", ");

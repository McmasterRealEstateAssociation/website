/** Queries and derived values for events in content/site.ts. */
import { copy, events, site, type SiteEvent } from "@/content/site";
import {
  formatDayLong,
  formatDayShort,
  formatLongDate,
  formatShortDate,
  formatTime,
  toCalendarStamp,
} from "./dates";
import { joinNames, possessive, shortName, firstName, fill } from "./text";

/** Events the public can see. Drafts never leave this file. */
export const publicEvents = (): SiteEvent[] => events.filter((e) => e.status !== "draft");

export const getEvent = (slug: string): SiteEvent | undefined =>
  publicEvents().find((e) => e.slug === slug);

/** When the event is over: its end time, or the end of its day for date-only events. */
export function endsAt(event: SiteEvent): number {
  if (event.end) return Date.parse(event.end);
  if (event.start) return Date.parse(event.start) + 3 * 60 * 60 * 1000;
  if (event.date) return Date.parse(`${event.date}T23:59:59-05:00`);
  return 0;
}

/** Sort key: when the event starts (or its date). */
const startsAt = (event: SiteEvent) =>
  Date.parse(event.doorsOpen ?? event.start ?? (event.date ? `${event.date}T12:00:00Z` : "1970-01-01"));

/** Announced events that haven't ended yet (as of `now`), soonest first. */
export function upcomingEvents(now: number = Date.now()): SiteEvent[] {
  return publicEvents()
    .filter((e) => e.status === "announced" && endsAt(e) > now)
    .sort((a, b) => startsAt(a) - startsAt(b));
}

/** Past events, most recent first. An announced event counts as past once it has ended. */
export function pastEvents(now: number = Date.now()): SiteEvent[] {
  return publicEvents()
    .filter((e) => e.status === "past" || (e.status === "announced" && endsAt(e) <= now))
    .sort((a, b) => startsAt(b) - startsAt(a));
}

export const isUpcoming = (event: SiteEvent, now: number = Date.now()) =>
  event.status === "announced" && endsAt(event) > now;

/* Display helpers ------------------------------------------------------------------------ */

/** "Wednesday, October 7, 2026" or the event's date label. */
export function eventDateLong(event: SiteEvent): string {
  if (event.start) return formatLongDate(event.start);
  if (event.dateLabel) return event.dateLabel;
  if (event.date) return formatDayLong(event.date);
  return "";
}

/** "Oct 7" */
export function eventDateShort(event: SiteEvent): string {
  if (event.start) return formatShortDate(event.start);
  if (event.date) return formatDayShort(event.date);
  return event.dateLabel ?? "";
}

/** "Doors 5:30 PM, starts 6:00 PM" style parts. */
export const doorsTime = (event: SiteEvent) => (event.doorsOpen ? formatTime(event.doorsOpen) : undefined);
export const startTime = (event: SiteEvent) => (event.start ? formatTime(event.start) : undefined);
export const endTime = (event: SiteEvent) => (event.end ? formatTime(event.end) : undefined);

/** The time row for a spec sheet: doors if known, otherwise the start time. */
export function timeFact(event: SiteEvent): { label: string; value: string } | undefined {
  const doors = doorsTime(event);
  if (doors) return { label: "Doors", value: doors };
  const start = startTime(event);
  return start ? { label: "Time", value: start } : undefined;
}

/** "Room 101, McMaster University" or "Room to be announced, McMaster University". */
export function eventPlace(event: SiteEvent): string {
  const room = event.location.room || (isUpcoming(event) ? copy.event.roomTba : "");
  return [room, event.location.building ?? site.venue.name].filter(Boolean).join(", ");
}

export const eventHighlights = (event: SiteEvent) =>
  event.highlights.filter((h) => !h.onlyWithHeadshots || event.headshotsConfirmed).map((h) => h.text);

export const eventAgenda = (event: SiteEvent) =>
  event.agenda.map((a) => ({
    time: a.time,
    text: event.headshotsConfirmed && a.textWithHeadshots ? a.textWithHeadshots : a.text,
  }));

export const speakerNames = (event: SiteEvent) => joinNames(event.speakers.map((s) => shortName(s.name)));

export function filmingNotice(event: SiteEvent): string {
  const names = joinNames(event.speakers.map((s) => firstName(s.name)));
  return fill(copy.event.filmingNotice, { speakers: names ? possessive(names) : "our speakers'" });
}

/** The first photo of the recap, if any (for listings). */
export const coverPhoto = (event: SiteEvent) => event.recap?.photos[0];

export const eventPath = (event: SiteEvent) => `/events/${event.slug}`;
export const eventUrl = (event: SiteEvent) => `${site.url}${eventPath(event)}`;
export const icsPath = (event: SiteEvent) => `/events/${event.slug}/calendar.ics`;

/** When people should show up: doors if known, otherwise the start. */
const calendarStart = (event: SiteEvent) => event.doorsOpen ?? event.start;

function calendarDetails(event: SiteEvent): string {
  const lines: string[] = [];
  if (event.subtitle) lines.push(event.subtitle);
  if (event.doorsOpen && event.start) {
    lines.push(`Doors ${formatTime(event.doorsOpen)}, starts ${formatTime(event.start)}.`);
  }
  if (event.rsvpUrl) lines.push(`Free ticket: ${event.rsvpUrl}`);
  lines.push(`Details: ${eventUrl(event)}`);
  return lines.join("\n");
}

export function googleCalendarUrl(event: SiteEvent): string | undefined {
  const from = calendarStart(event);
  if (!from || !event.end) return undefined;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} (MREA)`,
    dates: `${toCalendarStamp(from)}/${toCalendarStamp(event.end)}`,
    details: calendarDetails(event),
    location: `${eventPlace(event)}, ${site.venue.streetAddress}, ${site.venue.locality}, ${site.venue.region} ${site.venue.postalCode}`,
    ctz: "America/Toronto",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** RFC 5545 calendar file for one event. */
export function icsFile(event: SiteEvent): string | undefined {
  const from = calendarStart(event);
  if (!from || !event.end) return undefined;
  const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const fold = (line: string) => {
    const out: string[] = [];
    let rest = line;
    while (rest.length > 74) {
      out.push(rest.slice(0, 74));
      rest = " " + rest.slice(74);
    }
    out.push(rest);
    return out.join("\r\n");
  };
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//McMaster Real Estate Association//mcmastermrea.com//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@mcmastermrea.com`,
    `DTSTAMP:${toCalendarStamp(from)}`,
    `DTSTART:${toCalendarStamp(from)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escape(`${event.title} (MREA)`)}`,
    `DESCRIPTION:${escape(calendarDetails(event))}`,
    `LOCATION:${escape(`${eventPlace(event)}, ${site.venue.streetAddress}, ${site.venue.locality}, ${site.venue.region} ${site.venue.postalCode}`)}`,
    `URL:${eventUrl(event)}`,
    `ORGANIZER;CN=${escape(site.name)}:mailto:${site.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

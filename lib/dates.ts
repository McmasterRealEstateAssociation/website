/**
 * Date and time formatting. Everything is shown in Toronto time, whatever time zone the
 * server or build machine is in.
 */
export const TIME_ZONE = "America/Toronto";

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, ...options });

const longDate = fmt({ weekday: "long", month: "long", day: "numeric", year: "numeric" });
const longDateNoYear = fmt({ weekday: "long", month: "long", day: "numeric" });
const shortDate = fmt({ month: "short", day: "numeric" });
const monthDay = fmt({ month: "long", day: "numeric" });
const time = fmt({ hour: "numeric", minute: "2-digit" });
const isoDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** A calendar date (YYYY-MM-DD) as a Date at noon UTC, which is the same day in Toronto. */
const fromDay = (day: string) => new Date(`${day}T12:00:00Z`);

/** "Wednesday, October 7, 2026" */
export const formatLongDate = (iso: string) => longDate.format(new Date(iso));
/** "Wednesday, October 7" */
export const formatLongDateNoYear = (iso: string) => longDateNoYear.format(new Date(iso));
/** "Oct 7" */
export const formatShortDate = (iso: string) => shortDate.format(new Date(iso));
/** "5:30 PM" */
export const formatTime = (iso: string) => time.format(new Date(iso));

/** For YYYY-MM-DD calendar dates: "Thursday, January 29, 2026" */
export const formatDayLong = (day: string) => longDate.format(fromDay(day));
/** For YYYY-MM-DD calendar dates: "October 7" */
export const formatDayMonth = (day: string) => monthDay.format(fromDay(day));
/** For YYYY-MM-DD calendar dates: "Oct 7" */
export const formatDayShort = (day: string) => shortDate.format(fromDay(day));

/** Today's date in Toronto as YYYY-MM-DD. */
export const torontoToday = (now: Date = new Date()) => isoDay.format(now);

/** An ISO time as a UTC calendar stamp, e.g. 20261007T213000Z (for .ics and Google Calendar). */
export const toCalendarStamp = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

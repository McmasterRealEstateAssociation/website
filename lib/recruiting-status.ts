import type { Recruiting, RecruitingStatus } from "@/content/site";

/** YYYY-MM-DD for `now` in Toronto. */
const torontoDay = (now: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

/**
 * The recruiting status to show on a given day. "closed" always wins. Otherwise recruiting is
 * closed after closesOn, open inside the window when there's an application link, and
 * opening soon before that.
 */
export function recruitingStatusOn(
  r: Pick<Recruiting, "status" | "opensOn" | "closesOn" | "applyUrl">,
  now: Date,
): RecruitingStatus {
  if (r.status === "closed") return "closed";
  const today = torontoDay(now);
  if (today > r.closesOn) return "closed";
  if (r.applyUrl && (today >= r.opensOn || r.status === "open")) return "open";
  return "opening-soon";
}

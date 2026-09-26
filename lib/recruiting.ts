import { recruiting, type RecruitingStatus } from "@/content/site";
import { recruitingStatusOn } from "./recruiting-status";

/** Recruiting status as of `now` (build time on the server). */
export const effectiveRecruitingStatus = (now: Date = new Date()): RecruitingStatus =>
  recruitingStatusOn(recruiting, now);

/** True when the home page and links page should mention recruiting. */
export const isRecruiting = (status: RecruitingStatus) => status === "open" || status === "opening-soon";

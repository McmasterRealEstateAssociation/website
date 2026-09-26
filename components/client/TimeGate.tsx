"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import type { Recruiting, RecruitingStatus } from "@/content/site";
import { recruitingStatusOn } from "@/lib/recruiting-status";

const MAX_TIMEOUT = 2 ** 31 - 1;

/** Re-renders when `at` (ms) passes, so an open page updates without a reload. */
function subscribeUntil(at: number | undefined) {
  return (onChange: () => void) => {
    if (at === undefined) return () => {};
    const delay = at - Date.now();
    if (delay <= 0 || delay > MAX_TIMEOUT) return () => {};
    const id = window.setTimeout(onChange, delay + 250);
    return () => window.clearTimeout(id);
  };
}

/**
 * Shows `children` until the time `until` (ISO string), then `fallback`. The server renders
 * the build-time answer (`visibleAtBuild`); the browser corrects it with the real time, so
 * RSVP buttons disappear after an event ends without a rebuild.
 */
export function TimeGate({
  until,
  visibleAtBuild,
  children,
  fallback = null,
}: {
  until: string;
  visibleAtBuild: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const end = Date.parse(until);
  const visible = useSyncExternalStore(
    subscribeUntil(end),
    () => Date.now() < end,
    () => visibleAtBuild,
  );
  return <>{visible ? children : fallback}</>;
}

const noopSubscribe = () => () => {};

/** Picks the recruiting variant for today's date, starting from the build-time status. */
export function RecruitingGate({
  recruiting,
  statusAtBuild,
  variants,
}: {
  recruiting: Pick<Recruiting, "status" | "opensOn" | "closesOn" | "applyUrl">;
  statusAtBuild: RecruitingStatus;
  variants: Partial<Record<RecruitingStatus, ReactNode>>;
}) {
  const status = useSyncExternalStore(
    noopSubscribe,
    () => recruitingStatusOn(recruiting, new Date()),
    () => statusAtBuild,
  );
  return <>{variants[status] ?? null}</>;
}

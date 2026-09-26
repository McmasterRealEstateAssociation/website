import type { ReactNode } from "react";

/** Key facts set like a property spec sheet: label on the left, value on the right. */
export function SpecSheet({
  rows,
  className = "",
}: {
  rows: { label: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`border-t border-grey/25 ${className}`}>
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-grey/25 py-3.5">
          <dt className="pt-[0.2em] text-label font-semibold uppercase tracking-[0.12em] text-grey">{row.label}</dt>
          <dd className="font-medium text-maroon-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

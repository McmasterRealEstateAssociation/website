import { MARK_PATH } from "./mark-paths";

/** The MREA mark (ring, buildings and lettering) in a single colour. */
export function Mark({
  className = "",
  color = "currentColor",
  title,
}: {
  className?: string;
  color?: string;
  /** Give a title when the mark stands alone; leave it out when text next to it names the club. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path fill={color} fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}

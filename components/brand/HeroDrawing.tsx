import { BUILDING_PARTS } from "./mark-paths";

/**
 * The hero's one bold move: the mark's buildings as a fine gold line drawing, set like an
 * architect's elevation (ground line, datum lines and centre lines). Coordinates share the
 * logo's 1000-unit space. The drawing is clipped at the ground line, as in an elevation, and
 * the viewBox ends just below the ground so it can sit on the bottom edge of its section. The ground
 * and datum lines run past the viewBox; the section clips them at its edges.
 */
const GROUND = 516.9;
// How far the view extends below the ground line (the centre lines dip below grade).
const BELOW = 44;
const PARTS = Object.values(BUILDING_PARTS);

// Heights worth marking with a datum line: tower top, roof ridge, sign top.
const DATUMS = [133.92, 236, 271.7];
// Centre lines: house, tower, storefront.
const AXES = [250.6, 499.9, 737.2];

export function HeroDrawing({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`96 84 800 ${BELOW + GROUND - 84}`}
      className={`draw-on-load overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="var(--color-gold)"
      strokeLinejoin="miter"
    >
      <defs>
        <clipPath id="above-ground">
          <rect x="-5000" y="-5000" width="10000" height={5000 + GROUND} />
        </clipPath>
      </defs>

      <g className="draw-guide" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.32">
        {DATUMS.map((y) => (
          <line key={y} x1="112" x2="4000" y1={y} y2={y} strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
        ))}
        {AXES.map((x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1="95"
            y2={GROUND + BELOW}
            strokeDasharray="14 5 2 5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      <g clipPath="url(#above-ground)" strokeWidth="1.4">
        {PARTS.map((d, i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            className="draw"
            vectorEffect="non-scaling-stroke"
            style={{ animationDelay: `${0.12 * i}s` }}
          />
        ))}
      </g>

      <line
        className="draw"
        pathLength={1}
        x1="-4000"
        x2="4000"
        y1={GROUND}
        y2={GROUND}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

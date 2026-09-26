import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MARK_PATH } from "@/components/brand/mark-paths";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const MAROON = "#7A003C";
const GOLD = "#FDBF57";

const fontDir = join(process.cwd(), "assets/fonts");
const fonts = Promise.all([
  readFile(join(fontDir, "Cinzel-600.ttf")),
  readFile(join(fontDir, "Montserrat-500.ttf")),
  readFile(join(fontDir, "Montserrat-600.ttf")),
]);

const markSrc = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path fill="${GOLD}" fill-rule="evenodd" d="${MARK_PATH}"/></svg>`,
).toString("base64")}`;

/**
 * A social card: maroon field, the gold mark, a Cinzel title and up to two Montserrat lines.
 * `kicker` is a short gold label (e.g. the event format). Sized for 1200 x 630.
 */
export async function ogImage({
  title,
  kicker,
  lines = [],
}: {
  title: string;
  kicker?: string;
  lines?: string[];
}) {
  const [cinzel, montserrat500, montserrat600] = await fonts;
  const titleSize = title.length > 42 ? 58 : title.length > 26 ? 66 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: MAROON,
          padding: "0 88px",
          fontFamily: "Montserrat",
          color: "white",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={markSrc} width={250} height={250} alt="" style={{ flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 72, flexGrow: 1 }}>
          {kicker && (
            <div style={{ display: "flex", color: GOLD, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{kicker}</div>
          )}
          <div
            style={{
              display: "flex",
              fontFamily: "Cinzel",
              fontSize: titleSize,
              lineHeight: 1.08,
              fontWeight: 600,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", width: 72, height: 3, background: GOLD, marginTop: 30, marginBottom: 26 }} />
          {lines.map((line) => (
            <div key={line} style={{ display: "flex", fontSize: 27, lineHeight: 1.4, fontWeight: 500, opacity: 0.95 }}>
              {line}
            </div>
          ))}
          <div style={{ display: "flex", fontSize: 22, fontWeight: 600, marginTop: 30, color: GOLD }}>
            McMaster Real Estate Association
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Cinzel", data: cinzel, weight: 600, style: "normal" },
        { name: "Montserrat", data: montserrat500, weight: 500, style: "normal" },
        { name: "Montserrat", data: montserrat600, weight: 600, style: "normal" },
      ],
    },
  );
}

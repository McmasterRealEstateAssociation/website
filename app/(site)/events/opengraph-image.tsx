import { copy, site } from "@/content/site";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${copy.events.title} | ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: copy.events.title, lines: [copy.events.intro] });
}

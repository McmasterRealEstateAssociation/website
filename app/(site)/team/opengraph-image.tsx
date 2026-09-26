import { copy, site } from "@/content/site";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${copy.team.title} | ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: copy.team.title, lines: [copy.team.intro] });
}

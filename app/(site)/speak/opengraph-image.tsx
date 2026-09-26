import { copy, site } from "@/content/site";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${copy.speak.heading} | ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: copy.speak.heading, lines: [copy.speak.lead] });
}

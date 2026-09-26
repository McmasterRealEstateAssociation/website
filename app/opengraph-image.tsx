import { site } from "@/content/site";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${site.name} (${site.shortName})`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: site.name, lines: [site.tagline] });
}

import { site } from "@/content/site";
import { eventDateLong, getEvent, publicEvents, speakerNames } from "@/lib/events";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `An event from the ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;

export function generateStaticParams() {
  return publicEvents().map((event) => ({ slug: event.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return ogImage({ title: site.name });
  const who = speakerNames(event);
  return ogImage({
    kicker: event.format,
    title: event.title,
    lines: [who ? `With ${who}` : "", eventDateLong(event)].filter(Boolean),
  });
}

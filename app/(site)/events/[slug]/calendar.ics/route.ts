import { BUILD_TIME } from "@/lib/build-time";
import { getEvent, icsFile, upcomingEvents } from "@/lib/events";

// A static calendar file for each upcoming event, generated at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return upcomingEvents(BUILD_TIME).map((event) => ({ slug: event.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  const body = event ? icsFile(event) : undefined;
  if (!event || !body) return new Response("Not found", { status: 404 });
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}

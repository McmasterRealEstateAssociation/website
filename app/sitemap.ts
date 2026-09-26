import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { eventPath, publicEvents } from "@/lib/events";

/** Every public page. Draft events are never listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/events", "/team", "/speak", "/join", "/links"];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path === "/" ? "" : path}` })),
    ...publicEvents().map((event) => ({ url: `${site.url}${eventPath(event)}` })),
  ];
}

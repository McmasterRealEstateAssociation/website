import type { Metadata } from "next";
import { site } from "@/content/site";

/** Shared Open Graph fields. A page's `openGraph` replaces the layout's, so every page repeats these. */
export const baseOpenGraph = {
  type: "website",
  siteName: `${site.name} (${site.shortName})`,
  locale: "en_CA",
} as const;

/** Per-page metadata: unique title and description, canonical URL, and matching social tags. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${site.name} (${site.shortName})`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title: fullTitle, description, url: path },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

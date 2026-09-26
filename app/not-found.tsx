import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ButtonLink, Container } from "@/components/ui";
import { copy } from "@/content/site";

export const metadata: Metadata = {
  title: copy.notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="bg-maroon text-white outline-none">
        <Container className="pb-28 pt-20 sm:pb-36 sm:pt-28">
          <h1 className="font-display text-h1">{copy.notFound.heading}</h1>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/" variant="gold">
              {copy.notFound.home}
            </ButtonLink>
            <ButtonLink href="/events" variant="outline-light">
              {copy.notFound.events}
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

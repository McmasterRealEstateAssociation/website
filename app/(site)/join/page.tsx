import type { Metadata } from "next";
import { ButtonLink, Container, Section } from "@/components/ui";
import { copy, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: copy.join.title,
  description: copy.join.description,
  path: "/join",
});

export default function JoinPage() {
  return (
    <>
      <section className="bg-maroon text-white">
        <Container className="pb-18 pt-12 sm:pb-24 sm:pt-16">
          <h1 className="font-display text-h1">{copy.join.heading}</h1>
          <p className="mt-5 max-w-prose text-lead">{copy.join.lead}</p>
          <p className="mt-4 max-w-prose text-white/90">{copy.join.what}</p>
          <div className="mt-9">
            <ButtonLink href={site.memberFormUrl} variant="gold">
              {copy.memberButton}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Section tone="white" aria-labelledby="follow">
        <h2 id="follow" className="font-display text-h2 text-maroon">
          {copy.join.followHeading}
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={site.instagram} variant="outline-dark">
            {copy.join.instagram}
          </ButtonLink>
          <ButtonLink href={site.linkedin} variant="outline-dark">
            {copy.join.linkedin}
          </ButtonLink>
        </div>

        <div id="privacy" className="mt-20 max-w-prose scroll-mt-8 border-t border-grey/25 pt-8">
          <h2 className="font-sans text-h3 font-semibold tracking-normal text-maroon-ink">{copy.join.privacyHeading}</h2>
          <p className="mt-3 text-small text-grey">{copy.join.privacy}</p>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { speakerLine } from "@/components/events";
import { PersonRing } from "@/components/PersonRing";
import { ButtonLink, Container, Section, TextLink } from "@/components/ui";
import { copy, partners, site } from "@/content/site";
import { publicEvents } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";
import { shortName } from "@/lib/text";

export const metadata: Metadata = pageMetadata({
  title: copy.speak.title,
  description: copy.speak.description,
  path: "/speak",
});

export default function SpeakPage() {
  // Past speakers come straight from the events data.
  const pastSpeakers = publicEvents()
    .filter((e) => e.status === "past")
    .flatMap((e) => e.speakers);
  const partnerMail = `mailto:${site.email}?subject=${encodeURIComponent(copy.speak.partnerSubject)}`;

  return (
    <>
      <section className="bg-maroon text-white">
        <Container className="pb-16 pt-12 sm:pb-20 sm:pt-16">
          <h1 className="font-display text-h1">{copy.speak.heading}</h1>
          <p className="mt-5 max-w-prose text-lead text-white/90">{copy.speak.lead}</p>
        </Container>
      </section>

      <Section tone="white">
        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-h2 text-maroon">{copy.speak.formatHeading}</h2>
            <p className="mt-5 max-w-prose">{copy.speak.format}</p>
            <h2 className="mt-14 font-display text-h2 text-maroon">{copy.speak.handleHeading}</h2>
            <p className="mt-5 max-w-prose">{copy.speak.handle}</p>
          </div>
          <div>
            <h2 className="font-display text-h2 text-maroon">{copy.speak.getHeading}</h2>
            <ul className="mt-5 border-t border-grey/25">
              {copy.speak.get.map((item) => (
                <li key={item} className="border-b border-grey/25 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {pastSpeakers.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-h2 text-maroon">{copy.speak.pastSpeakersHeading}</h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2">
              {pastSpeakers.map((s) => (
                <li key={s.name} className="flex items-center gap-5">
                  <PersonRing name={s.name} photo={s.photo} size={96} />
                  <div>
                    <p className="text-h3 font-semibold">{shortName(s.name)}</p>
                    <p className="mt-1 text-small text-grey">{speakerLine(s)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-20 flex flex-wrap items-center gap-x-5 gap-y-3">
          <ButtonLink href={site.speakerFormUrl} variant="maroon">
            {copy.speak.applyButton}
          </ButtonLink>
          <p>
            {copy.speak.orEmail}{" "}
            <TextLink href={`mailto:${site.email}`} className="font-semibold text-maroon">
              {site.email}
            </TextLink>
          </p>
        </div>
        <p className="mt-8 max-w-prose text-small text-grey">{copy.speak.independent}</p>
      </Section>

      <Section tone="maroon" aria-labelledby="partner">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
          <div className="max-w-2xl">
            <h2 id="partner" className="font-display text-h2">
              {copy.speak.partnerHeading}
            </h2>
            <p className="mt-5 text-white/90">{copy.speak.partner}</p>
          </div>
          <div>
            <ButtonLink href={partnerMail} variant="gold">
              {copy.speak.partnerButton}
            </ButtonLink>
          </div>
        </div>

        {/* Partners: nothing renders while the list is empty. */}
        {partners.length > 0 && (
          <ul className="mt-14 grid gap-8 border-t border-gold/40 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <li key={p.name}>
                {p.logo && <Image src={p.logo.src} alt={p.logo.alt} className="h-12 w-auto" />}
                <p className="mt-3 font-semibold">{p.url ? <TextLink href={p.url}>{p.name}</TextLink> : p.name}</p>
                {p.description && <p className="mt-1 text-small text-white/85">{p.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

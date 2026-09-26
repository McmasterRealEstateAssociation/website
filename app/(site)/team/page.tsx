import type { Metadata } from "next";
import { RecruitingGate } from "@/components/client/TimeGate";
import { InstagramText } from "@/components/InstagramText";
import { PersonRing } from "@/components/PersonRing";
import { ButtonLink, Container, Section } from "@/components/ui";
import { copy, recruiting, team } from "@/content/site";
import { formatDayMonth } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";
import { effectiveRecruitingStatus } from "@/lib/recruiting";
import { fill } from "@/lib/text";
import { BUILD_TIME } from "@/lib/build-time";

export const metadata: Metadata = pageMetadata({
  title: copy.team.title,
  description: copy.team.description,
  path: "/team",
});

export default function TeamPage() {
  const members = team.filter((m) => m.status === "active");
  const statusAtBuild = effectiveRecruitingStatus(new Date(BUILD_TIME));

  const windowLine = fill(copy.team.windowLine, {
    opensOn: formatDayMonth(recruiting.opensOn),
    closesOn: formatDayMonth(recruiting.closesOn),
  });

  const recruitingDetails = (withApply: boolean) => (
    <>
      <p className="mt-5 text-lead font-medium">{fill(copy.team.openingSoonLead, { season: recruiting.season })}</p>
      <p className="mt-2 text-white/90">{windowLine}</p>
      <h3 className="mt-12 text-h3 font-semibold text-gold">{copy.team.rolesHeading}</h3>
      <ul className="mt-4 border-t border-gold/40">
        {recruiting.roles.map((role) => (
          <li key={role.title} className="grid gap-2 border-b border-gold/40 py-6 md:grid-cols-[16rem_1fr] md:gap-10">
            <p className="font-semibold">{role.title}</p>
            <p className="max-w-prose text-white/90">{role.description}</p>
          </li>
        ))}
      </ul>
      {withApply ? (
        <div className="mt-10">
          <ButtonLink href={recruiting.applyUrl} variant="gold">
            {copy.team.applyButton}
          </ButtonLink>
        </div>
      ) : (
        <p className="mt-10 text-white/90">
          <InstagramText text={copy.team.followLine} linkClassName="text-gold" />
        </p>
      )}
    </>
  );

  return (
    <>
      <section className="bg-maroon text-white">
        <Container className="pb-16 pt-12 sm:pb-20 sm:pt-16">
          <h1 className="font-display text-h1">{copy.team.title}</h1>
          <p className="mt-5 max-w-prose text-lead text-white/90">{copy.team.intro}</p>
        </Container>
      </section>

      <Section tone="white" aria-label={copy.team.title}>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {members.map((m) => (
            <li key={m.name} className="flex flex-col items-center text-center">
              <PersonRing name={m.name} photo={m.photo} size={132} />
              <p className="mt-4 font-semibold leading-snug">{m.name}</p>
              <p className="mt-1 text-small text-grey">{m.role}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="maroon" aria-labelledby="recruiting">
        <h2 id="recruiting" className="font-display text-h2">
          {copy.team.recruitingHeading}
        </h2>
        <RecruitingGate
          recruiting={recruiting}
          statusAtBuild={statusAtBuild}
          variants={{
            "opening-soon": recruitingDetails(false),
            open: recruitingDetails(true),
            closed: (
              <p className="mt-5 max-w-prose text-lead">
                <InstagramText text={copy.team.closed} linkClassName="text-gold" />
              </p>
            ),
          }}
        />
      </Section>
    </>
  );
}

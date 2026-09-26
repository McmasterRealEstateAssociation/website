@AGENTS.md

# MREA website: context for Claude Code

The public site of the **McMaster Real Estate Association (MREA)**, a student-run club at McMaster University in Hamilton, Ontario. Live at https://mcmastermrea.com. Non-developer execs update it using HOW-TO-UPDATE.md.

## Non-negotiables

1. **Club-first.** The president is also a licensed real estate agent. Nothing may promote his business: no "Salvati Sells", no salvatisells.com, no personal phone or email, no brokerage attached to his name. The only contact is McmasterMREA@outlook.com.
2. **Brokerage-neutral.** Brokerages appear only as a speaker's affiliation.
3. **Truth over hype.** Only publish claims supported by confirmed facts. Never invent numbers, testimonials, partners, awards or attendance. Never say "McMaster's only" real estate club. If unsure, leave it out and tell the user.
4. **Brand.** Colours, fonts and logo rules below. Never use McMaster University's logo, shield or wordmark (writing the words is fine). Never describe MREA as part of McMaster University.
5. **Non-commercial.** No payments, donations, ads or paid placements (Vercel Hobby plan).
6. **Static site only.** No backend, database, auth, form backend, server actions, API routes or secrets. Every route must be statically generated. Sign-ups use Microsoft Forms; registration uses Eventbrite.
7. **Separation.** Never open or change anything related to the Salvati Sells CRM (its repos, Vercel projects, Supabase projects or files), and never change global git or GitHub CLI settings.
8. **Keep history.** Never delete repos, branches, tags, Vercel projects, deployments or domains. Never spend money.

## Brand

- Heritage Maroon `#7A003C` (dominant), Heritage Gold `#FDBF57` (accents, rules, rings, buttons on maroon), Heritage Grey `#495965` (small details), white, black (text on gold). **Never gold text on white.**
- Cinzel for headlines, Montserrat for everything else. Body 17–18 px, lines under 80 characters.
- The one bold move is the hero's gold line drawing of the mark (an architect's elevation). Everything else stays quiet.
- Avoid: eyebrow labels above every heading, middle-dot metadata strings, arrows on buttons, grids of identical shadowed cards, decorative gradients, fade-up animations on every section, 01/02/03 markers on non-sequences.
- Voice: confident, specific, peer-to-peer, never salesy. Sentence case. Buttons say exactly what happens.
- DESIGN-PLAN.md has the tokens and layouts.

## Content model

- **All copy, links, events, team, recruiting, partners and stats live in `content/site.ts`.** Don't hard-code copy in components.
- Events: `draft` (hidden everywhere, including sitemap, links page and JSON-LD), `announced` (public, with RSVP until `end`), `past` (recap). Headshot text only when `headshotsConfirmed`.
- Recruiting: `closed` / `opening-soon` / `open`; it opens itself once `applyUrl` is set and the date is inside the window.
- `partners` and `stats` render nothing while empty; stats must be real, verified numbers.
- Times are ISO strings with the Toronto offset, and are always displayed in America/Toronto (`lib/dates.ts`).
- Time-aware behaviour without rebuilds lives in `components/client/TimeGate.tsx`.
- Photos: prepare with `npm run photos`, import statically in `content/site.ts`, always with real alt text.
- The mark's vector data (`components/brand/mark-paths.ts`) is generated from `C:\MREA\tooling`; don't edit it by hand.

## Accounts and deploys

- Push to `main` as the club GitHub account (the remote URL includes `McmasterRealEstateAssociation@`). Commit identity is set in this repo only.
- Vercel: team **MREA's projects** (`mreas-projects`), project **mcmastermrea**, Git-connected. Every push to `main` deploys to production.
- `site.url` in `content/site.ts` is the single source of the canonical URL.

## Before every push, run the QA

1. `npm run lint` and `npm run build`: zero errors, and every route marked static (○ or ●) in the build output.
2. Start the site (`npx next start -p 3100`), run `npm run qa:shots`, and **look at** the screenshots at 390, 768 and 1440 px: no overflow, cramped spacing or awkward breaks.
3. If you touched events, recruiting or dates: stop the server and run `npm run qa:switches`.
4. Content rules: the built output must not contain "37,000", "Salvati Sells", "salvatisells", "905-" or "only club" wording. "Royal LePage" may appear only as the January 2026 speakers' affiliation.
5. After pushing, confirm the Vercel deployment is Ready and check the live pages.

# mcmastermrea.com

The website of the **McMaster Real Estate Association (MREA)**, a student-run club at McMaster University in Hamilton, Ontario.

Live at **https://mcmastermrea.com**.

## Where everything lives

Everything is owned by the club, not by any one person:

| What | Where |
|---|---|
| Code | GitHub, club account **McmasterRealEstateAssociation**, repo [`website`](https://github.com/McmasterRealEstateAssociation/website) |
| Hosting | Vercel, club team **MREA's projects**, project **mcmastermrea** (free Hobby plan) |
| Domain | **mcmastermrea.com**, registered through the club's Vercel team |
| Sign-ins | Both accounts sign in with the club's GitHub account (McmasterMREA@outlook.com) |

Every push to `main` deploys to production automatically, usually within a minute or two.

`www.mcmastermrea.com`, `mcmastermrea.vercel.app` and the old address `mrea-website.vercel.app` all redirect to https://mcmastermrea.com.

## How it's built

- Next.js (App Router), TypeScript and Tailwind CSS 4. Every page is static; there's no database, login or server code.
- **All text, links, events, the team and recruiting live in one file: [`content/site.ts`](content/site.ts).** Components only format that data.
- Sign-ups use Microsoft Forms, and event registration uses Eventbrite.
- Brand: Heritage Maroon `#7A003C`, Heritage Gold `#FDBF57`, Cinzel for headlines, Montserrat for everything else. The full brand guide is `C:\MREA\brand-kit\BRAND.md` (outside this repo).

## Updating the site

See **[HOW-TO-UPDATE.md](HOW-TO-UPDATE.md)**. It has step-by-step recipes for announcing events, recaps, the team, recruiting and more, each with a one-line prompt you can give Claude Code.

## Running it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Before pushing, run the checks:

```bash
npm run lint
npm run build
npx playwright install chromium    # once per computer
npx next start -p 3100             # in a second terminal, then:
npm run qa:shots                   # screenshots of every page into qa-shots/
npm run qa:switches                # rebuilds with each content switch flipped (stop the server first)
```

## Other scripts

| Command | What it does |
|---|---|
| `npm run photos -- <folder> <files...>` | Resizes photos and strips their metadata into `content/photos/<folder>/` |
| `npm run graphics -- <event-slug>` | Renders Instagram, Eventbrite and LinkedIn graphics for an event into `C:\MREA\brand-kit\events\` |

## Contact

McMaster Real Estate Association: [McmasterMREA@outlook.com](mailto:McmasterMREA@outlook.com)

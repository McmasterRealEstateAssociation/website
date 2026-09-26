# Design plan

The site for the McMaster Real Estate Association (MREA). This is the plan that was checked against the build brief before any code was written. The brief's design system (section 9) and page specs (section 10) are the source of truth; this file turns them into tokens and layouts.

## Direction

A premium, established organization: restrained, confident, unmistakably McMaster maroon. One bold move, the hero's gold line drawing of the mark set like an architect's elevation. Everything else is quiet: generous space, strict alignment, real photos, and a property spec sheet for event facts.

## Tokens

### Colour

| Token | Value | Use |
|---|---|---|
| `maroon` | `#7A003C` | Hero, alternating sections, header |
| `maroon-deep` | `#5C002D` | Footer (a shade of maroon, for depth) |
| `maroon-ink` | `#2A0E1C` | Body text on white (a very dark maroon, reads as near-black) |
| `gold` | `#FDBF57` | Mark, rules, rings, primary buttons and headline accents **on maroon only** |
| `grey` | `#495965` | Small details: labels, captions, dividers |
| `white` | `#FFFFFF` | Light sections, text on maroon |
| `black` | `#000000` | Text on gold buttons |
| `line-on-white` | `#495965` at 25% | Hairlines on white |
| `line-on-maroon` | `#FDBF57` at 35% | Hairlines on maroon |

Contrast (WCAG): white on maroon 11.1:1, gold on maroon 6.8:1, maroon on white 11.1:1, grey on white 7.3:1, black on gold 12.4:1. Gold never appears as text on white.

### Type

Cinzel (headlines) and Montserrat (everything else), via `next/font/google`, Latin subset, `display: swap`.

| Role | Font | Size (mobile → desktop) | Line height |
|---|---|---|---|
| Display (home H1) | Cinzel 600 | 40 → 72 px, `clamp(2.5rem, 6.5vw, 4.5rem)` | 1.05 |
| H1 (pages) | Cinzel 600 | 36 → 56 px | 1.1 |
| H2 | Cinzel 600 | 28 → 40 px | 1.15 |
| H3 | Montserrat 600 | 19 → 21 px | 1.3 |
| Lead | Montserrat 400 | 19 → 22 px | 1.55 |
| Body | Montserrat 400 | 17 → 18 px | 1.65 |
| Small / labels | Montserrat 500 | 14 → 15 px | 1.4 |

Text columns are capped at `64ch` so body lines stay under 80 characters. Body copy is sentence case and left-aligned. Labels in the spec sheet use small caps via Montserrat 600 at 13 px with modest tracking. They sit beside values, not above headings, so they're not eyebrows.

### Space and layout

- Content max width 1100 px (`max-w-[1100px]`), side padding 20 px mobile, 32 px tablet+.
- Section padding 72 px mobile, 112 px desktop.
- 8 px spacing grid.
- Tap targets 44 px minimum; buttons 48 px tall.
- Radius: 2 px on buttons and images (architectural, not bubbly). Rings are circles.

### Components

- **Buttons.** Primary on maroon: gold fill, black text. Primary on white: maroon fill, white text. Secondary: 1.5 px outline in the section's accent colour. Labels say exactly what happens. No arrows appended.
- **Gold ring.** Photos and monograms sit in a 2 px gold ring with 4 px of breathing space.
- **Spec sheet.** A two-column definition list, like a property listing: small-caps label left, value right, hairline between rows. Rows: Date, Doors, Place, Format, Price.
- **Hairline rules** separate items instead of card boxes and shadows.

### Motion

One page-load moment: the hero's line drawing draws itself once (stroke animation, about 1.8 s). Buttons and links get a quick colour transition and a visible focus ring. `prefers-reduced-motion` shows the finished drawing with no animation.

## Pages

Legend: `M` = maroon section, `W` = white section.

### Header (all pages except /links)

```
M ┌───────────────────────────────────────────────────────────────────────┐
  │ (mark) McMaster Real Estate      Events  Team  Speak & Partner  Join  │
  │        Association                               [Become a member]    │
  └───────────────────────────────────────────────────────────────────────┘
mobile:
  │ (mark) McMaster Real Estate Association                      [ Menu ] │
  │ ── menu panel (full width, stacked links, gold button last) ──        │
```

### Footer

```
M-deep
  (mark)  McMaster Real Estate Association
          A student-run club at McMaster University in Hamilton, Ontario.
  Events  Team  Speak & Partner  Join        Instagram  LinkedIn  Email
  ───────────────────────────────────────────────────────────────────────
  © 2026 McMaster Real Estate Association
```

### Home `/`

```
M  HERO
   ┌──────────────────────────────────┬─────────────────────────────────┐
   │ MCMASTER REAL ESTATE             │   gold line drawing of the mark │
   │ ASSOCIATION              (H1)    │   as an elevation: house, tower,│
   │ Tagline (lead, gold rule above)  │   storefront, ground line that  │
   │ Supporting line                  │   runs off the right edge,      │
   │ McMaster University, Hamilton.   │   faint datum lines             │
   │ [Primary]  [Secondary]           │                                 │
   └──────────────────────────────────┴─────────────────────────────────┘
   mobile: drawing sits behind/below the text at low opacity, text first.

W  NEXT EVENT (announced upcoming only; otherwise "Next event announced soon.")
   ┌───────────┬─────────────────────────────────────────────────────────┐
   │ (ring     │ Fireside chat                                           │
   │  photo or │ Six Figures in Your Early 20s            (H2)           │
   │  monogram)│ A fireside chat with Leo Puskar                         │
   │           │ Date  Wed, Oct 7, 5:30 PM    Place  Room, McMaster      │
   │           │ – highlight  – highlight  – highlight                   │
   │           │ [Details and RSVP]                                      │
   └───────────┴─────────────────────────────────────────────────────────┘

M  EVERY MREA EVENT GIVES YOU THREE THINGS (H2)
   ──────────────────── ──────────────────── ────────────────────  (gold rules)
   Someone doing it     Something to take    People worth
   for real (gold)      home                 meeting
   text                 text                 text

W  "You don't need to want a real estate career…" (large lead, maroon rule)
   PAST EVENTS (H2)
   ┌────────────────────────────┬──────────────────────────────────────┐
   │ photo (3:2)                │ Thursday, January 29, 2026            │
   │                            │ How a Brokerage Is Built From Scratch │
   │                            │ Nic Von Bredow, Stacey Adamson        │
   │                            │ See the recap                         │
   └────────────────────────────┴──────────────────────────────────────┘

M  FOR PROFESSIONALS: Speak at MREA (H2) + lead + [Speak or partner with MREA]

W  THE TEAM: Run by students, for students. [We're recruiting badge]
   ( JS ) ( JP ) ( MS ) ( TR ) ( NT )  monograms in gold rings
   [Meet the team]

M  JOIN BAND: Free to join. Open to every McMaster student. [Become a member]
```

### Events `/events`

```
M  EVENTS (H1)  Free, in person, and open to every McMaster student.
W  UPCOMING (H2): event rows, or "Next event announced soon. Follow @mcmastermrea…"
   PAST (H2): row = photo | date, title, speakers, "See the recap"
```

### Event `/events/[slug]`

```
M  Format (small label)
   TITLE (H1)
   Subtitle (lead)
   [Get your free ticket] (upcoming, before end, rsvpUrl set)  [Share]
W  ┌──────────────────────────────┬──────────────────────────────────┐
   │ Summary (body)                │ SPEC SHEET                       │
   │ What you get (H2) list        │ Date    Wednesday, October 7     │
   │ Agenda (H2) time | item list  │ Doors   5:30 PM                  │
   │ Filming notice (small, grey   │ Place   Room, McMaster Univ.     │
   │  rule on left)                │ Format  Fireside chat            │
   │                               │ Price   Free                     │
   │                               │ Add to Google Calendar · .ics    │
   └──────────────────────────────┴──────────────────────────────────┘
   SPEAKERS: ring photo/monogram, name, title, org, Instagram
   PAST ONLY: recap summary, photo gallery (2–3 column grid), speaker list
```

The calendar links render as two separate text links, not a dot-joined string.

### Team `/team`

```
M  THE TEAM (H1)  MREA is run by students, for students.
W  grid: ring monogram/photo, name, role (2 cols mobile, 5 cols desktop)
M  RECRUITING
   opening-soon: "We're recruiting for 2026–27." "Applications open Oct 7 and close Oct 25."
                 role list (hairline separated) + "Follow @mcmastermrea so you don't miss it."
   open:         same + [Apply now]
   closed:       "Recruiting is closed for now. Follow @mcmastermrea to hear when it reopens."
```

### Speak & Partner `/speak`

```
M  SPEAK AT MREA (H1)  lead
W  The format (H2) text     |  What you get (H2) list
   What we handle (H2) text
   Past speakers: name, title, org (from events)
   [Apply to speak]  or email McmasterMREA@outlook.com
   Independent of any brokerage. Our speakers come from across the industry.
M  PARTNER WITH MREA (H2) copy  [Email us about partnering]
```

### Join `/join`

```
M  JOIN MREA (H1) Membership is free and open to every McMaster student…
   Members hear about events first… [Become a member]
W  Prefer to just follow along? Instagram, LinkedIn
   #privacy note (small, grey)
```

### Links `/links` (standalone, mobile-first, no header)

```
M  (badge)
   MCMASTER REAL ESTATE ASSOCIATION
   tagline
   [ Next event: Six Figures in Your Early 20s, Oct 7 ]  (only if announced & upcoming)
   [ Become a member ]
   [ Team applications open Oct 7 ] / [ Apply to join the team ]
   [ Speak or partner with MREA ]
   [ Follow us on LinkedIn ]
   [ Email us ]
   [ Visit our website ]
```

Full-width 56 px buttons, 440 px max column.

### 404

```
M  This page doesn't exist. (H1)
   [Go to the home page]  [See our events]
```

## Checked against the brief

- [x] Maroon dominates, gold accents; no gold text on white; tints of maroon only.
- [x] Cinzel for headlines, Montserrat for everything else; body 17–18 px; lines under 80 characters.
- [x] The one bold move is the hero elevation drawing. Nothing else competes with it.
- [x] Spec sheet for event facts; gold rings for people; real photos only.
- [x] Alternating maroon and white sections; 1100 px max width; 44 px targets; left-aligned body text.
- [x] Full name "McMaster Real Estate Association" is in the header, hero H1, footer and titles.
- [x] No McMaster University logo, shield or wordmark.
- [x] One call to action per section; button labels say what happens.

## Checked against the "avoid" list, and what changed

- **All-caps eyebrow above every heading.** The first sketch put "Upcoming", "Past events" and "For professionals" labels above each H2. Removed them. The event format appears once, as part of the event's own facts, not as a pattern above every heading.
- **Metadata joined with middle dots.** The first sketch had "Oct 7 · 5:30 PM · Room" under the next-event title. Replaced with the labelled spec-sheet rows, and calendar links are two separate links.
- **Arrows on buttons.** None.
- **Grids of identical rounded cards with soft shadows.** The "three things", roles and events are hairline-separated columns or rows, with no boxes or shadows. The team grid is people in rings, not cards.
- **Gradient washes.** None. Flat maroon and white.
- **Fade-and-slide-up on every section.** None. The single load animation is the hero drawing.
- **01/02/03 markers on non-sequences.** None. The agenda uses real times because it is a sequence.

## Engineering notes

- All copy and links come from `content/site.ts`; components only format data.
- Every route is statically generated (`generateStaticParams` with `dynamicParams = false` for events). Build output is checked for static markers.
- Dates and times always render in `America/Toronto` through one helper in `lib/dates.ts`.
- A small client component (`TimeGate`) hides RSVP buttons after an event ends and swaps the home page's next event for "announced soon", with no rebuild. Recruiting also re-checks its window on the client.
- `.ics` files are static route handlers (`force-static`), one per announced upcoming event.
- Images use `next/image` with static imports.

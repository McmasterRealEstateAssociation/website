# How to update the website

Everything the site says lives in one file: **`content/site.ts`**. You change the data there, push, and the site updates itself in a minute or two.

You don't need to be a developer. Pick whichever way suits you:

- **With Claude Code (easiest).** Open PowerShell, run `cd C:\MREA\website` then `claude`, and paste the one-line prompt from the recipe below. Claude Code makes the change, runs the checks, and pushes.
- **On GitHub.** Sign in as the club, open [`content/site.ts`](https://github.com/McmasterRealEstateAssociation/website/blob/main/content/site.ts), click the pencil icon, edit, and choose **Commit changes** to `main`. Use this only for text changes; adding photos is easier with Claude Code.

After any change, wait two minutes and check https://mcmastermrea.com.

## Ground rules

- **Only publish what's true and confirmed.** No invented numbers, testimonials, partners or attendance figures. If something isn't confirmed, leave the field blank (`""`) and the site hides it.
- **Club-first and brokerage-neutral.** No personal businesses, and a brokerage appears only as a speaker's affiliation.
- **Times are Toronto time**, written with their offset: `-04:00` from March to early November (EDT), `-05:00` from November to March (EST). For example, `"2026-10-07T18:00:00-04:00"` is 6:00 PM on October 7, 2026.
- Keep the quotes, commas and brackets exactly as they are around the text you change. If the site doesn't update, the build probably failed: ask Claude Code to "check the last Vercel build and fix it".

---

## 1. Announce an event

An event appears on the site only when its `status` is `"announced"`. While it's `"draft"`, it's hidden everywhere: pages, the links page, the sitemap and search engines.

**Fields to set** (in the event's entry in the `events` list):

| Field | What to put |
|---|---|
| `status` | `"announced"` |
| `title`, `subtitle`, `format` | The event's name, a short line under it, and the format (for example `"Fireside chat"`) |
| `doorsOpen`, `start`, `end` | ISO times with the Toronto offset |
| `location.room` | The room, for example `"MDCL 1105"`. Blank shows "Room to be announced". |
| `rsvpUrl` | The Eventbrite link. Blank hides the RSVP button. |
| `speakers` | Name, title, organization, optional Instagram handle, photo and bio |
| `summary`, `highlights`, `agenda` | What the event is, what people get, and the timeline |
| `filmed` | `true` shows the filming notice |
| `promo.carousel` | Text for the Instagram carousel (see section 8) |

**Example:** announcing the Leo Puskar fireside once the room and Eventbrite are confirmed:

```ts
    status: "announced",
    ...
    location: { room: "MDCL 1105", building: "McMaster University" },
    rsvpUrl: "https://www.eventbrite.ca/e/six-figures-in-your-early-20s-tickets-1234567890",
```

**For a brand-new event,** copy an existing event's whole `{ ... }` block, paste it at the top of the `events` list, and change every field. The `slug` becomes the page address: use `year-month-short-name`, for example `"2026-11-mortgage-basics"` for `mcmastermrea.com/events/2026-11-mortgage-basics`.

Once it's announced, the site automatically:
- shows it as the next event on the home page, the events page and the links page;
- adds "Add to Google Calendar" and an `.ics` calendar file;
- tells search engines about it (structured data);
- hides the RSVP button once the event's `end` time has passed, with no update needed.

**Claude Code prompt:**
> Announce event 2026-10-leo-puskar using HOW-TO-UPDATE.md: room MDCL 1105, Eventbrite link https://www.eventbrite.ca/e/…, then run the checks, push, and regenerate its graphics.

## 2. Confirm headshots

For events offering free LinkedIn headshots, the headshot highlight and the "and headshots" agenda wording appear only when confirmed.

**Field:** `headshotsConfirmed: true` on the event.

**Claude Code prompt:**
> Headshots are confirmed for 2026-10-leo-puskar. Set headshotsConfirmed to true, push, and regenerate its graphics.

## 3. Mark an event done, and add a recap and photos

After an event ends, the RSVP button disappears by itself. To turn the page into a recap:

1. Prepare the photos. This resizes them and strips hidden location data:
   ```
   npm run photos -- 2026-10-leo-puskar "C:\path\to\photo1.jpg" "C:\path\to\photo2.jpg"
   ```
   They're saved in `content/photos/2026-10-leo-puskar/`. Pick 6–12 sharp, well-lit photos of the speakers, the room and the team. Avoid close-ups of individual attendees.
2. At the top of `content/site.ts`, add one import line per photo:
   ```ts
   import leoRoom from "./photos/2026-10-leo-puskar/img-1234.jpg";
   ```
3. On the event, set `status: "past"` and add a `recap`:
   ```ts
   recap: {
     summary: "What happened, in one or two true sentences.",
     photos: [
       { src: leoRoom, alt: "Leo Puskar answers a question from a student in the front row." },
     ],
   },
   ```
   Write real alt text: describe what's in the photo for someone who can't see it.

The event moves to "Past events", shows the recap and gallery, and its speakers appear under "Past speakers" on the Speak page.

**Claude Code prompt:**
> Mark 2026-10-leo-puskar as past. Recap: "…". Photos are in C:\path\to\folder. Pick the best 6–12, prepare them, write alt text by looking at each one, then push.

## 4. Update the team and their photos

**Fields:** the `team` list. Each person has `name`, `role`, `status` and an optional `photo`.

- Only people with `status: "active"` appear. Set someone to `"alumni"` to take them off the site, or delete their line.
- Without a photo, the site shows their initials in a gold ring.

**Adding a photo:**
```
npm run photos -- team "C:\path\to\justin.jpg"
```
Then add the import and the photo:
```ts
import justinPhoto from "./photos/team/justin.jpg";
...
{ name: "Justin Piper-Merrett", role: "VP Events", status: "active", photo: { src: justinPhoto, alt: "Justin Piper-Merrett" } },
```
Use a head-and-shoulders photo; the ring crops it to a circle.

**Claude Code prompt:**
> Update the team: add Jane Doe as VP Marketing (photo at C:\path\jane.jpg) and set Noah Topper to alumni. Push when done.

## 5. Open and close recruiting

**Fields:** the `recruiting` block.

| Field | Meaning |
|---|---|
| `status` | `"closed"`, `"opening-soon"` or `"open"` |
| `season` | For example `"2026–27"` |
| `opensOn`, `closesOn` | Dates as `"YYYY-MM-DD"` (Toronto) |
| `applyUrl` | The application form. Blank means there's nothing to apply to yet. |
| `roles` | Each open role's `title` and one-sentence `description` |

How the site behaves:
- **opening-soon:** the Team page announces the dates and roles, the home page shows a "We're recruiting" badge, and the links page says "Team applications open …".
- It **switches to open by itself** on `opensOn` once `applyUrl` is set, showing an "Apply now" button, with no update needed on the day.
- After `closesOn` it shows as **closed**. Setting `status: "closed"` closes it at any time.

**Claude Code prompts:**
> Recruiting: the application form is https://forms.office.com/… Set applyUrl and push.

> Close recruiting now and push.

## 6. Add a partner

Partners appear on the Speak & Partner page. Nothing shows while the list is empty. Only add organizations that have actually agreed to partner.

**Fields:** the `partners` list. Each has `name`, optional `url`, optional `logo` (a photo object, like team photos) and an optional one-line `description`.

```ts
export const partners: Partner[] = [
  { name: "Example Mortgage Co.", url: "https://example.com", description: "Covered the pizza for our October fireside." },
];
```

**Claude Code prompt:**
> Add Example Mortgage Co. (https://example.com) as a partner: "Covered the pizza for our October fireside." Logo at C:\path\logo.png. Push.

## 7. Change the domain

The address is set in one place: `site.url` in `content/site.ts`. It feeds every canonical link, the sitemap, social previews and structured data.

1. In Vercel (club team **MREA's projects**, project **mcmastermrea**), go to **Settings → Domains** and add the new domain. Make it the primary domain, and set the old one to redirect to it.
2. Change `site.url` to the new address, for example `url: "https://newdomain.ca"`, and push.
3. Regenerate the QR codes and update the links on Instagram, LinkedIn, Eventbrite and hoo.be (see `C:\MREA\LAUNCH-CHECKLIST.md`).

**Claude Code prompt:**
> We're moving the site to https://newdomain.ca. Update site.url, check the new domain in Vercel is primary with the old one redirecting, regenerate the QR codes, and push.

## 8. Make the event graphics

```
npm run graphics -- 2026-10-leo-puskar
```

This renders the Instagram carousel (from the event's `promo.carousel`), an Instagram story, an Eventbrite banner and a LinkedIn image into `C:\MREA\brand-kit\events\<event>\`. Draft events go into a `preview\` subfolder so nobody posts them by mistake. Speaker photos appear in a gold ring when the speaker has one; headshots are mentioned only once they're confirmed.

**Claude Code prompt:**
> Regenerate the graphics for 2026-10-leo-puskar and show me the carousel.

## Checks before every push

Claude Code runs these for you. To run them yourself:

```
npm run lint
npm run build
```

Both must finish with no errors. For bigger changes, also run the screenshot and switch checks described in the README.

/**
 * Everything the website says lives in this one file.
 *
 * To update the site, change the data below and push. HOW-TO-UPDATE.md has step-by-step
 * recipes (announcing an event, confirming headshots, recruiting, the team, and more).
 *
 * Rules that keep the site trustworthy:
 * - Only write what's true and confirmed. Leave a field blank ('') rather than guess.
 * - All times are Toronto time. Write them as ISO strings with the offset,
 *   e.g. '2026-10-07T18:00:00-04:00' (EDT, summer) or '2026-01-29T18:00:00-05:00' (EST, winter).
 */
import type { StaticImageData } from "next/image";

import janRoom from "./photos/2026-01-brokerage-built-from-scratch/room-nic-speaking.jpg";
import janStacey from "./photos/2026-01-brokerage-built-from-scratch/stacey-presenting-career-paths.jpg";
import janBoth from "./photos/2026-01-brokerage-built-from-scratch/nic-and-stacey.jpg";
import janGroup from "./photos/2026-01-brokerage-built-from-scratch/speakers-with-student.jpg";
import janAudience from "./photos/2026-01-brokerage-built-from-scratch/audience.jpg";
import janRoomWide from "./photos/2026-01-brokerage-built-from-scratch/room-wide.jpg";
import nicPortrait from "./photos/2026-01-brokerage-built-from-scratch/portrait-nic-von-bredow.jpg";
import staceyPortrait from "./photos/2026-01-brokerage-built-from-scratch/portrait-stacey-adamson.jpg";
import leoPortrait from "./photos/2026-11-leo-puskar/portrait-leo-puskar.jpg";

/* ------------------------------------------------------------------------------------------ */
/* Types                                                                                       */
/* ------------------------------------------------------------------------------------------ */

export type Photo = {
  src: StaticImageData;
  /** Describe what's in the photo for people using screen readers. */
  alt: string;
};

export type Person = {
  name: string;
  /** Job title, e.g. "Owner and Broker of Record". */
  title?: string;
  /** Organization or brokerage, shown only as the person's affiliation. */
  org?: string;
  photo?: Photo;
  /** Instagram handle without the @. */
  instagram?: string;
  bio?: string;
};

/**
 * - draft: not shown anywhere on the site (pages, sitemap, links page, structured data).
 * - announced: public, with RSVP while it's upcoming.
 * - past: shown as a past event with its recap.
 */
export type EventStatus = "draft" | "announced" | "past";

export type HighlightItem = {
  text: string;
  /** Show only when the event's headshots are confirmed. */
  onlyWithHeadshots?: boolean;
};

export type AgendaItem = {
  /** Display time, e.g. "5:30 PM". */
  time: string;
  text: string;
  /** Replaces `text` when headshots are confirmed. */
  textWithHeadshots?: string;
};

export type CarouselSlide =
  | { kind: "headline"; headline: string; smallLine: string }
  | { kind: "speaker"; lines: string[] }
  | { kind: "list"; heading: string; items: HighlightItem[] }
  | { kind: "details"; lines: string[]; footnote?: string };

export type SiteEvent = {
  slug: string;
  status: EventStatus;
  title: string;
  subtitle?: string;
  format: string;
  /** ISO times with the Toronto offset. Leave out for past events without exact times. */
  start?: string;
  end?: string;
  doorsOpen?: string;
  /** For events without exact times: the calendar date (YYYY-MM-DD) and how to display it. */
  date?: string;
  dateLabel?: string;
  location: {
    /** Room, or leave blank if it isn't confirmed yet. */
    room: string;
    building?: string;
  };
  /** Eventbrite link. Leave blank until registration is live. */
  rsvpUrl: string;
  speakers: Person[];
  summary?: string;
  highlights: HighlightItem[];
  agenda: AgendaItem[];
  filmed: boolean;
  headshotsConfirmed: boolean;
  recap?: {
    summary: string;
    photos: Photo[];
    takeaways?: string[];
  };
  promo?: {
    carousel: CarouselSlide[];
  };
};

export type TeamMember = {
  name: string;
  role: string;
  status: "active" | "alumni";
  photo?: Photo;
};

export type RecruitingStatus = "closed" | "opening-soon" | "open";

export type Recruiting = {
  /**
   * closed: not recruiting. opening-soon: announce the dates. open: show "Apply now".
   * The site switches opening-soon to open by itself once applyUrl is set and today is
   * inside the window, and treats recruiting as closed after closesOn.
   */
  status: RecruitingStatus;
  season: string;
  /** Dates as YYYY-MM-DD (Toronto). */
  opensOn: string;
  closesOn: string;
  /** Team application form. Leave blank until it exists. */
  applyUrl: string;
  roles: { title: string; description: string }[];
};

export type Partner = { name: string; url?: string; logo?: Photo; description?: string };
export type Stat = { value: string; label: string };

/* ------------------------------------------------------------------------------------------ */
/* Site                                                                                        */
/* ------------------------------------------------------------------------------------------ */

export const site = {
  name: "McMaster Real Estate Association",
  shortName: "MREA",
  tagline: "Real estate careers, investing and money skills for every McMaster student.",
  description:
    "MREA is a student-run club at McMaster University that connects students in every faculty with people building careers and wealth in real estate, through free events, honest conversations and a growing network.",
  /** The site's one canonical address. Change it here if the domain ever changes. */
  url: "https://mcmastermrea.com",
  email: "McmasterMREA@outlook.com",
  instagram: "https://www.instagram.com/mcmastermrea/",
  instagramHandle: "mcmastermrea",
  // The URL in the 2026 build brief (/company/mcmaster-real-estate-association) returns 404;
  // this is the club's live page (checked September 2026).
  linkedin: "https://www.linkedin.com/company/mrea-mcmaster",
  memberFormUrl:
    "https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUOFJXT09KS09EVzZaTkE3NTA1UUdJOU5ETy4u",
  speakerFormUrl:
    "https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUNE1VU1A3MVFOTUlJR1k3NFg3U0hJWkZOTi4u",
  location: "McMaster University, Hamilton, Ontario",
  /** Used for event listings and structured data. */
  venue: {
    name: "McMaster University",
    streetAddress: "1280 Main Street West",
    locality: "Hamilton",
    region: "ON",
    postalCode: "L8S 4L8",
    country: "CA",
  },
  footerLine: "A student-run club at McMaster University in Hamilton, Ontario.",
} as const;

/* ------------------------------------------------------------------------------------------ */
/* Page copy                                                                                   */
/* ------------------------------------------------------------------------------------------ */

export const copy = {
  nav: [
    { label: "Events", href: "/events" },
    { label: "Team", href: "/team" },
    { label: "Speak & Partner", href: "/speak" },
    { label: "Join", href: "/join" },
  ],
  memberButton: "Become a member",

  home: {
    title: "McMaster Real Estate Association (MREA) | Student real estate club at McMaster University",
    heroSupport:
      "We bring people who are doing it for real into the room: agents, investors, lenders and builders. You get honest answers, something to take home, and people worth meeting.",
    heroLocation: "McMaster University, Hamilton.",
    ctaTicket: "Get your free ticket",
    ctaSeeEvents: "See our events",
    nextEventHeading: "Next event",
    nextEventLink: "Details and RSVP",
    threeThingsHeading: "Every MREA event gives you three things",
    threeThings: [
      {
        title: "Someone doing it for real",
        text: "Speakers who've built careers and wealth in real estate, talking candidly about how they did it, including what didn't work.",
      },
      {
        title: "Something to take home",
        text: "A skill, a tool, a new connection, a prize. You should leave with more than notes.",
      },
      {
        title: "People worth meeting",
        text: "Students from every faculty who are serious about their futures, and professionals who remember the ones who show up.",
      },
    ],
    everyFacultyHeading: "For every faculty",
    everyFaculty:
      "You don't need to want a real estate career. If you want to understand money, sales or investing, you'll get something out of every event.",
    pastEventsHeading: "Past events",
    recapLink: "See the recap",
    professionalsHeading: "Speak at MREA",
    professionalsText:
      "Share how you built your career with McMaster students who chose to be in the room.",
    professionalsButton: "Speak or partner with MREA",
    teamHeading: "Run by students, for students",
    teamButton: "Meet the team",
    recruitingBadge: "We're recruiting",
    joinBand: "Free to join. Open to every McMaster student.",
  },

  events: {
    title: "Events",
    description:
      "Free, in-person events for McMaster students with people building careers and wealth in real estate. See what's next and what we've done.",
    intro: "Free, in person, and open to every McMaster student.",
    upcomingHeading: "Upcoming",
    pastHeading: "Past events",
    noneUpcoming: "Next event announced soon. Follow @mcmastermrea to hear first.",
  },

  event: {
    rsvp: "Get your free ticket",
    detailsLabel: "Event details",
    whatYouGet: "What you get",
    agenda: "Agenda",
    speakers: "Speakers",
    speaker: "Speaker",
    recap: "Recap",
    photos: "Photos from the night",
    addToGoogle: "Add to Google Calendar",
    downloadIcs: "Download calendar file (.ics)",
    share: "Share this event",
    shareCopied: "Link copied",
    price: "Free",
    roomTba: "Room to be announced",
    ended: "This event has ended. Thanks to everyone who came.",
    filmingNotice:
      "This event will be photographed and filmed for MREA's and {speakers} social channels. Camera-free seating is available; just ask a team member.",
  },

  team: {
    title: "The team",
    description: "MREA is run by McMaster students, for McMaster students. Meet the team and see when we're recruiting.",
    intro: "MREA is run by students, for students.",
    recruitingHeading: "Join the team",
    openingSoonLead: "We're recruiting for {season}.",
    windowLine: "Applications open {opensOn} and close {closesOn}.",
    followLine: "Follow @mcmastermrea so you don't miss it.",
    applyButton: "Apply now",
    closed: "Recruiting is closed for now. Follow @mcmastermrea to hear when it reopens.",
    rolesHeading: "Open roles",
  },

  speak: {
    title: "Speak & Partner",
    description:
      "Speak at MREA or partner with us. Share how you built your career with McMaster students in a relaxed fireside chat.",
    heading: "Speak at MREA",
    lead: "Share how you built your career with McMaster students who chose to be in the room.",
    formatHeading: "The format",
    format:
      "A relaxed fireside chat, not a lecture. About 40 minutes of conversation with one of our execs, then questions from the audience. No slides needed.",
    getHeading: "What you get",
    get: [
      "A room of engaged students from across McMaster",
      "Promotion across MREA's Instagram, LinkedIn and campus channels, with you tagged",
      "Photos from the night you're welcome to use",
      "An early look at students who'll be joining the industry",
    ],
    handleHeading: "What we handle",
    handle: "The room, promotion, registration, a moderator and the details. You show up and talk.",
    pastSpeakersHeading: "Past speakers",
    applyButton: "Apply to speak",
    orEmail: "or email",
    independent: "Independent of any brokerage. Our speakers come from across the industry.",
    partnerHeading: "Partner with MREA",
    partner:
      "Help put on events students remember by covering food or a door prize, or by bringing your team to meet students early in their careers. We keep partnerships simple and relevant to students.",
    partnerButton: "Email us about partnering",
    partnerSubject: "Partnering with MREA",
  },

  join: {
    title: "Join",
    description: "Join MREA for free. Membership is open to every McMaster student, in any faculty and any year.",
    heading: "Join MREA",
    lead: "Membership is free and open to every McMaster student, in any faculty and any year.",
    what: "Members hear about events first and get a reminder before each one. That's it.",
    followHeading: "Prefer to just follow along?",
    instagram: "Follow on Instagram",
    linkedin: "Follow on LinkedIn",
    privacyHeading: "Privacy",
    privacy:
      "We use your information only to send MREA updates. We never sell or share it. To be removed, email McmasterMREA@outlook.com.",
  },

  links: {
    title: "Links",
    description: "Everything MREA in one place: our next event, membership, the team and how to get in touch.",
    nextEvent: "Next event",
    member: "Become a member",
    applyTeam: "Apply to join the team",
    teamOpens: "Team applications open {date}",
    speak: "Speak or partner with MREA",
    linkedin: "Follow us on LinkedIn",
    email: "Email us",
    website: "Visit our website",
  },

  notFound: {
    title: "Page not found",
    heading: "This page doesn't exist.",
    home: "Go to the home page",
    events: "See our events",
  },

  footer: {
    social: { instagram: "Instagram", linkedin: "LinkedIn", email: "Email" },
  },

  a11y: {
    skip: "Skip to content",
    menuOpen: "Menu",
    menuClose: "Close",
    mainNav: "Main",
    footerNav: "Footer",
    newTab: "(opens in a new tab)",
    onInstagram: "on Instagram",
  },
} as const;

/* ------------------------------------------------------------------------------------------ */
/* Events                                                                                      */
/* ------------------------------------------------------------------------------------------ */

export const events: SiteEvent[] = [
  {
    slug: "2026-11-leo-puskar",
    // Leo's one rule: no income talk at all, anywhere in the copy or the graphics.
    status: "announced",
    title: "Starting Young in Sales",
    subtitle: "An unscripted fireside chat with RE/MAX agent Leo Puskar",
    format: "Fireside chat",
    doorsOpen: "2026-11-18T17:30:00-05:00",
    start: "2026-11-18T18:00:00-05:00",
    end: "2026-11-18T19:45:00-05:00",
    location: {
      room: "MCCD 7120 (Collaboration Studio)",
      building: "McLean Centre for Collaborative Discovery, McMaster University",
    },
    rsvpUrl:
      "https://www.eventbrite.ca/e/starting-young-in-sales-a-fireside-chat-with-remax-agent-leo-puskar-tickets-2002476414862",
    speakers: [
      {
        name: "Leo Puskar",
        title: "Award-Winning RE/MAX Realtor",
        org: "RE/MAX Escarpment Realty",
        photo: { src: leoPortrait, alt: "Leo Puskar" },
        instagram: "puskarleo",
        bio: "Residential, investment and new construction",
      },
    ],
    summary:
      "Most people wait until after graduation to start building something. Leo Puskar didn't. He's an award-winning RE/MAX Escarpment agent who built his real estate business on his own in his early 20s, and he's joining us for an unscripted fireside chat. He hasn't seen a single question. We'll talk about how he found his first clients, how to handle rejection, how to read people and start conversations that go somewhere, and the sales skills that work just as well in an interview as in a deal.",
    highlights: [
      { text: "An unscripted fireside chat, then your questions" },
      { text: "Free pizza from 5:30 to 6:00, so come early" },
      {
        text: "A door prize draw for AirPods at 7:00. Bring friends: every friend who checks in and names you earns you a bonus entry. You must be in the room to win.",
      },
      { text: "A one-page recap of Leo's best advice, emailed to everyone who checks in" },
      {
        text: "A free LinkedIn headshot when you share this event to your story, tag @mcmastermrea and follow us (first 35)",
        onlyWithHeadshots: true,
      },
    ],
    agenda: [
      { time: "5:30 PM", text: "Doors, check-in and pizza (pizza until 6:00)" },
      { time: "6:00 PM", text: "Fireside chat with Leo" },
      { time: "6:40 PM", text: "Your questions" },
      { time: "7:00 PM", text: "Door prize draw, then networking until 7:45" },
    ],
    filmed: true,
    headshotsConfirmed: false,
    promo: {
      carousel: [
        {
          kind: "headline",
          headline: "What nobody tells you about starting young in sales.",
          smallLine: "MREA fireside, Wednesday, November 18",
        },
        {
          kind: "speaker",
          lines: [
            "Leo Puskar, award-winning RE/MAX Realtor.",
            "Built his business on his own in his early 20s. He hasn't seen a single question.",
          ],
        },
        {
          kind: "list",
          heading: "What we're asking him",
          items: [
            { text: "How he found his first clients" },
            { text: "How to handle rejection" },
            { text: "How to read people and start real conversations" },
            { text: "The sales skills that win interviews, not just deals" },
          ],
        },
        {
          kind: "list",
          heading: "What you get",
          items: [
            { text: "Free pizza until 6:00" },
            { text: "An AirPods door prize" },
            { text: "Your questions, answered live" },
            { text: "A one-page recap of Leo's best advice" },
            { text: "A free LinkedIn headshot (first 35)", onlyWithHeadshots: true },
          ],
        },
        {
          kind: "details",
          lines: ["Wednesday, November 18", "5:30 PM, {room}", "Free. Register at the link in bio."],
          footnote: "Pizza until 6:00. Bring friends: every friend who checks in and names you = +1 door prize entry.",
        },
      ],
    },
  },
  {
    slug: "2026-01-brokerage-built-from-scratch",
    status: "past",
    title: "How a Brokerage Is Built From Scratch",
    format: "Speaker event",
    // Date from the event photos' capture time (all taken January 29, 2026).
    date: "2026-01-29",
    location: { room: "", building: "McMaster University" },
    rsvpUrl: "",
    speakers: [
      {
        name: "Nicolas (Nic) Von Bredow",
        title: "Owner and Broker of Record",
        org: "Royal LePage Macro Realty",
        photo: { src: nicPortrait, alt: "Nic Von Bredow" },
      },
      {
        name: "Stacey Adamson",
        title: "Director, Agent Growth & Culture",
        org: "Royal LePage Macro Realty",
        photo: { src: staceyPortrait, alt: "Stacey Adamson" },
      },
    ],
    highlights: [],
    agenda: [],
    filmed: false,
    headshotsConfirmed: false,
    recap: {
      summary:
        "MREA's first event. Nic Von Bredow and Stacey Adamson walked students through what it takes to build a real estate brokerage from the ground up.",
      photos: [
        {
          src: janRoom,
          alt: "Nic Von Bredow speaks from the front of a lecture room while Stacey Adamson stands at the podium, with slides on Ontario real estate organizations on two screens.",
        },
        {
          src: janStacey,
          alt: "Stacey Adamson presents a Career Paths slide at the podium as Nic Von Bredow sits at the front of the room and students look on.",
        },
        {
          src: janBoth,
          alt: "Nic Von Bredow talks to the room from the front desk, with Stacey Adamson beside the projected Career Paths slide.",
        },
        {
          src: janRoomWide,
          alt: "A wide view of the lecture room: Stacey Adamson presents on two screens while students listen from the curved rows.",
        },
        {
          src: janAudience,
          alt: "Students seated at curved desks in the lecture room, listening to the talk.",
        },
        {
          src: janGroup,
          alt: "Nic Von Bredow and Stacey Adamson stand with a student holding a gift basket.",
        },
      ],
    },
  },
];

/* ------------------------------------------------------------------------------------------ */
/* Team, recruiting, partners, stats                                                           */
/* ------------------------------------------------------------------------------------------ */

export const team: TeamMember[] = [
  { name: "Julian Salvati", role: "President & Founder", status: "active" },
  { name: "Justin Piper-Merrett", role: "VP Events", status: "active" },
  { name: "Matthew Sulug", role: "VP Communications", status: "active" },
  { name: "Tanush Rathi", role: "VP Finance", status: "active" },
  { name: "Noah Topper", role: "VP External", status: "active" },
];

export const recruiting: Recruiting = {
  status: "open",
  season: "2026–27",
  opensOn: "2026-10-21",
  closesOn: "2026-11-04",
  applyUrl: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUOEpKOU01NFEzWVJTTTBEN1E4QVdLUlhLSS4u",
  roles: [
    {
      title: "VP Marketing",
      description: "Run MREA's Instagram and LinkedIn, design with our templates, and turn every event into content.",
    },
    {
      title: "Co-VP External",
      description: "Get MREA into classrooms and partner clubs, and help bring speakers and partners to the table.",
    },
    {
      title: "First-Year Representatives (2–3)",
      description: "Bring first-years to our events, help run event nights, and grow into leadership.",
    },
  ],
};

/**
 * Text for the recruiting graphics (npm run graphics -- recruiting). {season} and {closesOn}
 * fill in from the recruiting block above, so the graphics always match the site.
 */
export const recruitingPromo = {
  /** Carousel slide 1, and the title of the story and LinkedIn image. */
  headline: "We're building the {season} MREA team.",
  /** Carousel slide 2 lists every role with its description under this heading. */
  rolesHeading: "Open roles",
  /** The last slide and the story. The LinkedIn image shows the team page's address instead. */
  apply: "Apply by {closesOn}.",
  linkInBio: "Link in bio.",
};

/** Organizations that support MREA. Nothing renders while this is empty. */
export const partners: Partner[] = [];

/** Only real, verified numbers. Nothing renders while this is empty. */
export const stats: Stat[] = [];

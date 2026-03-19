const SPEAKER_FORM =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUNE1VU1A3MVFOTUlJR1k3NFg3U0hJWkZOTi4u";

const benefits = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    title: "Reach a Large Audience",
    description: "Present to a motivated audience of 37,000+ McMaster students across all faculties.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Share Your Story",
    description: "Inspire students by sharing how you built your career and the lessons you've learned.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Recruit Future Talent",
    description: "Connect directly with driven McMaster students who are eager to break into real estate.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Build Your Brand",
    description: "Establish yourself as a thought leader in the McMaster and Hamilton real estate community.",
  },
];

export default function SpeakAtMREA() {
  return (
    <section id="speak" className="bg-[#162d1f] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: copy */}
          <div>
            <p className="text-[#e0b84a] text-sm font-semibold uppercase tracking-widest mb-3">
              For Industry Professionals
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#faf6ef] font-bold mb-6">
              Speak at MREA
            </h2>
            <div className="w-12 h-0.5 bg-[#e0b84a] mb-8" />
            <p className="text-[#f4ede0]/70 leading-relaxed mb-4">
              We bring in real estate professionals to speak at our events —
              agents, investors, developers, brokers, and lenders. No
              presentations required, just a genuine conversation.
            </p>
            <p className="text-[#f4ede0]/70 leading-relaxed mb-10">
              If you&apos;ve built something worth talking about, we want to hear
              from you.
            </p>
            <a
              href={SPEAKER_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#e0b84a] text-[#0f2318] font-semibold rounded hover:bg-[#eac96a] transition-colors"
            >
              Apply to speak at MREA →
            </a>
          </div>

          {/* Right: benefits */}
          <div className="flex flex-col gap-5">
            {benefits.map(({ icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#e0b84a]/10 border border-[#e0b84a]/30 flex items-center justify-center text-[#e0b84a]">
                  {icon}
                </div>
                <div>
                  <h4 className="font-semibold text-[#faf6ef] text-sm mb-1">{title}</h4>
                  <p className="text-[#f4ede0]/55 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

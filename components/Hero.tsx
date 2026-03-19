const MEMBER_FORM =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUOFJXT09KS09EVzZaTkE3NTA1UUdJOU5ETy4u";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center bg-[#0f2318] relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1e3d2a_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#162d1f_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e0b84a]/40 bg-[#e0b84a]/10 text-[#e0b84a] text-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e0b84a] animate-pulse" />
          McMaster University · Hamilton, Ontario
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#faf6ef] leading-tight mb-6">
          McMaster Real Estate
          <br />
          <span className="text-[#e0b84a]">Association</span>
        </h1>

        <p className="text-lg md:text-xl text-[#f4ede0]/80 max-w-2xl mx-auto mb-4">
          Real estate builds more wealth than almost anything else.
        </p>
        <p className="text-base md:text-lg text-[#f4ede0]/60 max-w-2xl mx-auto mb-12">
          MREA connects McMaster&apos;s 37,000+ students with agents, investors,
          developers, and lenders who&apos;ve built real wealth — through expert
          talks, networking, and hands-on education.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={MEMBER_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-[#e0b84a] text-[#0f2318] font-semibold rounded hover:bg-[#eac96a] transition-colors text-base"
          >
            Become a Member
          </a>
          <a
            href="#events"
            className="px-8 py-3.5 border border-[#e0b84a]/60 text-[#e0b84a] font-semibold rounded hover:bg-[#e0b84a]/10 transition-colors text-base"
          >
            View Events
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-white/10 pt-12">
          {[
            { value: "37K+", label: "McMaster Students" },
            { value: "Free", label: "All Faculties Welcome" },
            { value: "100%", label: "Industry-Led Content" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-2xl font-bold text-[#e0b84a]">{value}</div>
              <div className="text-xs text-[#f4ede0]/50 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#f4ede0]/30 text-xs">
        <span>Scroll</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

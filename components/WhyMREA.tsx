const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Industry Speakers",
    description:
      "Hear directly from agents, investors, developers, and lenders who've built real wealth in real estate.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Professional Network",
    description:
      "Build relationships with industry professionals and peers that last beyond your time at McMaster.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Financial Literacy",
    description:
      "Understand mortgages, investing strategies, and housing markets before you graduate.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Career Pathways",
    description:
      "Explore residential sales, commercial real estate, development, property management, and proptech.",
  },
];

export default function WhyMREA() {
  return (
    <section id="about" className="bg-[#162d1f] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#e0b84a] text-sm font-semibold uppercase tracking-widest mb-3">
            Why Join
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#faf6ef] font-bold">
            Why MREA
          </h2>
          <div className="mt-4 w-12 h-0.5 bg-[#e0b84a] mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-[#1e3d2a] border border-white/10 rounded-xl p-8 hover:border-[#e0b84a]/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#e0b84a]/10 border border-[#e0b84a]/30 flex items-center justify-center text-[#e0b84a] mb-5 group-hover:bg-[#e0b84a]/20 transition-colors">
                {icon}
              </div>
              <h3 className="font-serif text-xl text-[#faf6ef] font-semibold mb-2">
                {title}
              </h3>
              <p className="text-[#f4ede0]/60 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

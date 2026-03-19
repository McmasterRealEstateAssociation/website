const team = [
  { name: "Julian Salvati", role: "President & Founder", initials: "JS" },
  { name: "Justin", role: "VP Events", initials: "J" },
  { name: "Matthew S", role: "VP Communications", initials: "MS" },
  { name: "Matthew H", role: "Co-VP Externals", initials: "MH" },
  { name: "Noah", role: "Co-VP Externals", initials: "N" },
  { name: "Tanush", role: "VP Finance", initials: "T" },
  { name: "Julian P", role: "VP Marketing", initials: "JP" },
];

export default function Leadership() {
  return (
    <section id="team" className="bg-[#0f2318] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#e0b84a] text-sm font-semibold uppercase tracking-widest mb-3">
            The Team
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#faf6ef] font-bold">
            Leadership
          </h2>
          <div className="mt-4 w-12 h-0.5 bg-[#e0b84a] mx-auto" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.map(({ name, role, initials }) => (
            <div
              key={name}
              className="bg-[#162d1f] border border-white/10 rounded-xl p-6 text-center hover:border-[#e0b84a]/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-[#1e3d2a] border border-[#e0b84a]/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-lg font-bold text-[#e0b84a]">
                  {initials}
                </span>
              </div>
              <p className="font-semibold text-[#faf6ef] text-sm mb-1">{name}</p>
              <p className="text-[#f4ede0]/50 text-xs">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

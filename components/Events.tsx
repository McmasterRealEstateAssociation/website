const upcomingEvents = [
  {
    title: "How to Break Into Real Estate While Still in School",
    speaker: "TBA Industry Professional",
    date: "April 2026",
    tag: "Upcoming",
  },
];

const pastEvents = [
  {
    title: "How a Brokerage Is Built From Scratch",
    speaker: "Nic Von Bredow",
    role: "Broker of Record, Royal LePage Macro Realty",
    date: "January 2026",
  },
];

export default function Events() {
  return (
    <section id="events" className="bg-[#0f2318] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#e0b84a] text-sm font-semibold uppercase tracking-widest mb-3">
            What&apos;s On
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#faf6ef] font-bold">
            Events
          </h2>
          <div className="mt-4 w-12 h-0.5 bg-[#e0b84a] mx-auto" />
        </div>

        {/* Upcoming */}
        <div className="mb-14">
          <h3 className="font-serif text-xl text-[#e0b84a] mb-6">Upcoming</h3>
          <div className="flex flex-col gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="relative bg-[#1e3d2a] border border-[#e0b84a]/30 rounded-xl p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-[#e0b84a]/20 text-[#e0b84a] rounded-full mb-3">
                    {event.tag}
                  </span>
                  <h4 className="font-serif text-lg text-[#faf6ef] font-semibold mb-1">
                    {event.title}
                  </h4>
                  <p className="text-[#f4ede0]/60 text-sm">{event.speaker}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[#e0b84a] text-sm font-semibold">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past */}
        <div>
          <h3 className="font-serif text-xl text-[#f4ede0]/50 mb-6">Past Events</h3>
          <div className="flex flex-col gap-4">
            {pastEvents.map((event) => (
              <div
                key={event.title}
                className="bg-[#162d1f] border border-white/10 rounded-xl p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-80"
              >
                <div>
                  <h4 className="font-serif text-lg text-[#faf6ef] font-semibold mb-1">
                    {event.title}
                  </h4>
                  <p className="text-[#f4ede0]/60 text-sm">
                    {event.speaker}
                    {event.role && (
                      <span className="text-[#f4ede0]/40"> · {event.role}</span>
                    )}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[#f4ede0]/40 text-sm">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

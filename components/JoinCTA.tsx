const MEMBER_FORM =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUOFJXT09KS09EVzZaTkE3NTA1UUdJOU5ETy4u";

export default function JoinCTA() {
  return (
    <section id="join" className="bg-[#1e3d2a] py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[#e0b84a] text-sm font-semibold uppercase tracking-widest mb-4">
          Get Involved
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-[#faf6ef] font-bold mb-6">
          Join MREA
        </h2>
        <div className="w-12 h-0.5 bg-[#e0b84a] mx-auto mb-8" />
        <p className="text-[#f4ede0]/70 text-lg leading-relaxed mb-12">
          Membership is free and open to all McMaster students, regardless of
          faculty. Whether you&apos;re interested in investing, a career in real
          estate, or just want to learn — you&apos;re welcome here.
        </p>
        <a
          href={MEMBER_FORM}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-4 bg-[#e0b84a] text-[#0f2318] font-bold text-lg rounded hover:bg-[#eac96a] transition-colors"
        >
          Become a Member
        </a>
        <p className="mt-5 text-[#f4ede0]/40 text-sm">
          Free for all McMaster students · All faculties welcome
        </p>
      </div>
    </section>
  );
}

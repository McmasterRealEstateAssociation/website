const MEMBER_FORM =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUOFJXT09KS09EVzZaTkE3NTA1UUdJOU5ETy4u";

export default function Footer() {
  return (
    <footer className="bg-[#0f2318] border-t border-white/10 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-xl font-bold text-[#e0b84a] mb-3">MREA</p>
            <p className="text-[#f4ede0]/50 text-sm leading-relaxed">
              McMaster Real Estate Association
              <br />
              McMaster University · Hamilton, Ontario
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-[#faf6ef] text-sm font-semibold mb-4">Navigation</p>
            <ul className="flex flex-col gap-2">
              {[
                ["About", "#about"],
                ["Events", "#events"],
                ["Speak at MREA", "#speak"],
                ["Team", "#team"],
                ["Join", "#join"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[#f4ede0]/50 text-sm hover:text-[#e0b84a] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <p className="text-[#faf6ef] text-sm font-semibold mb-4">Connect</p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://instagram.com/mcmastermrea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f4ede0]/50 text-sm hover:text-[#e0b84a] transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/mcmaster-real-estate-association"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f4ede0]/50 text-sm hover:text-[#e0b84a] transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:McmasterMREA@outlook.com"
                  className="text-[#f4ede0]/50 text-sm hover:text-[#e0b84a] transition-colors"
                >
                  McmasterMREA@outlook.com
                </a>
              </li>
              <li>
                <a
                  href="https://hoo.be/mrea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f4ede0]/50 text-sm hover:text-[#e0b84a] transition-colors"
                >
                  All Links
                </a>
              </li>
            </ul>
            <a
              href={MEMBER_FORM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 px-5 py-2.5 bg-[#e0b84a] text-[#0f2318] text-sm font-semibold rounded hover:bg-[#eac96a] transition-colors"
            >
              Become a Member
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-[#f4ede0]/30 text-xs">
          © {new Date().getFullYear()} McMaster Real Estate Association. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

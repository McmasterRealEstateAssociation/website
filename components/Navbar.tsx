"use client";

import { useState } from "react";

const MEMBER_FORM =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HcsYDRgK1N39JshRtC7O4igFUOFJXT09KS09EVzZaTkE3NTA1UUdJOU5ETy4u";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Speak", href: "#speak" },
  { label: "Team", href: "#team" },
  { label: "Join", href: "#join" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f2318]/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-serif text-lg font-bold text-[#e0b84a] tracking-wide">
          MREA
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream-100 text-[#f4ede0] hover:text-[#e0b84a] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={MEMBER_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 bg-[#e0b84a] text-[#0f2318] text-sm font-semibold rounded hover:bg-[#eac96a] transition-colors"
          >
            Become a Member
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#f4ede0] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#162d1f] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[#f4ede0] hover:text-[#e0b84a] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={MEMBER_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#e0b84a] text-[#0f2318] font-semibold rounded text-center hover:bg-[#eac96a] transition-colors"
          >
            Become a Member
          </a>
        </div>
      )}
    </header>
  );
}

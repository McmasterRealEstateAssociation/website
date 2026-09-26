"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Desktop navigation links, marking the current section. */
export function NavLinks({ links, label }: { links: readonly { label: string; href: string }[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-7">
        {links.map((link) => {
          const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className="inline-flex min-h-11 items-center border-b-2 border-transparent text-[0.9375rem] font-semibold text-white transition-colors hover:text-gold aria-[current=page]:border-gold"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

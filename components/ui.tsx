import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { copy } from "@/content/site";

type Tone = "maroon" | "white" | "deep";

const toneClass: Record<Tone, string> = {
  maroon: "bg-maroon text-white",
  white: "on-light bg-white text-maroon-ink",
  deep: "bg-maroon-deep text-white",
};

/** A full-width band with the site's alternating maroon/white rhythm. */
export function Section({
  tone = "white",
  className = "",
  children,
  ...rest
}: { tone?: Tone; className?: string; children: ReactNode } & ComponentProps<"section">) {
  return (
    <section className={`${toneClass[tone]} py-18 sm:py-24 lg:py-28 ${className}`} {...rest}>
      <Container>{children}</Container>
    </section>
  );
}

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-content px-5 sm:px-8 ${className}`}>{children}</div>;
}

type ButtonVariant = "gold" | "maroon" | "outline-light" | "outline-dark";

const buttonClass: Record<ButtonVariant, string> = {
  gold: "bg-gold text-black hover:bg-[#ffd07e] border-gold",
  maroon: "bg-maroon text-white hover:bg-maroon-deep border-maroon",
  "outline-light": "bg-transparent text-white border-white/70 hover:border-gold hover:text-gold",
  "outline-dark": "bg-transparent text-maroon border-maroon hover:bg-maroon hover:text-white",
};

const buttonBase =
  "inline-flex min-h-12 items-center justify-center rounded-[2px] border-[1.5px] px-6 py-3 text-center text-[0.9375rem] font-semibold tracking-[0.01em] transition-colors duration-150";

/** A link styled as a button. External links open in a new tab and say so to screen readers. */
export function ButtonLink({
  href,
  variant = "gold",
  external,
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = `${buttonBase} ${buttonClass[variant]} ${className}`;
  const isExternal = external ?? /^https?:/.test(href);
  if (isExternal) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> {copy.a11y.newTab}</span>
      </a>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export const buttonClasses = (variant: ButtonVariant) => `${buttonBase} ${buttonClass[variant]}`;

/** A plain text link, external-aware. */
export function TextLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const cls = `link-underline ${className}`;
  if (/^https?:/.test(href)) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> {copy.a11y.newTab}</span>
      </a>
    );
  }
  if (href.startsWith("mailto:") || href.endsWith(".ics")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** A short gold (on maroon) or maroon (on white) rule. */
export function Rule({ tone = "gold", className = "" }: { tone?: "gold" | "maroon"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[3px] w-14 ${tone === "gold" ? "bg-gold" : "bg-maroon"} ${className}`}
    />
  );
}

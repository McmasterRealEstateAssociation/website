import Image from "next/image";
import type { Photo } from "@/content/site";
import { initials } from "@/lib/text";

/** A person's photo, or their monogram, inside a thin gold ring. */
export function PersonRing({
  name,
  photo,
  size = 112,
  tone = "white",
  className = "",
}: {
  name: string;
  photo?: Photo;
  /** Outer size in px. */
  size?: number;
  /** The background the ring sits on. */
  tone?: "white" | "maroon";
  className?: string;
}) {
  const inner = size - 12;
  return (
    <div
      className={`relative shrink-0 rounded-full border-2 border-gold p-[4px] ${className}`}
      style={{ width: size, height: size }}
    >
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={inner}
          height={inner}
          sizes={`${inner}px`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`flex h-full w-full items-center justify-center rounded-full font-display font-semibold ${
            tone === "white" ? "bg-maroon text-gold" : "bg-maroon-deep text-gold"
          }`}
          style={{ fontSize: Math.round(size * 0.3) }}
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
}

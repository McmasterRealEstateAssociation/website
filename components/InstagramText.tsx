import { copy, site } from "@/content/site";

/** Renders copy that mentions @mcmastermrea, turning the handle into a link to Instagram. */
export function InstagramText({ text, linkClassName = "" }: { text: string; linkClassName?: string }) {
  const handle = `@${site.instagramHandle}`;
  const parts = text.split(handle);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`link-underline font-semibold ${linkClassName}`}
            >
              {handle}
              <span className="sr-only">
                {" "}
                {copy.a11y.onInstagram} {copy.a11y.newTab}
              </span>
            </a>
          )}
        </span>
      ))}
    </>
  );
}

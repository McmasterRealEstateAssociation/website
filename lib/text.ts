/** Fills {placeholders} in a copy string, e.g. fill("Hi {name}", { name: "Leo" }). */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/** "Leo" -> "Leo's", "Nic Von Bredow and Stacey Adamson" -> "... Adamson's" */
export const possessive = (name: string) => (name.endsWith("s") ? `${name}'` : `${name}'s`);

/** Joins names naturally: "A", "A and B", "A, B and C". */
export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Initials for a monogram: "Justin Piper-Merrett" -> "JP". */
export function initials(name: string): string {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** "Nicolas (Nic) Von Bredow" -> "Nic Von Bredow" (the name people use). */
export function shortName(name: string): string {
  const nick = name.match(/\(([^)]+)\)/)?.[1];
  if (!nick) return name;
  const parts = name.replace(/\s*\([^)]*\)/, "").split(/\s+/);
  return [nick, ...parts.slice(1)].join(" ");
}

export const firstName = (name: string) => shortName(name).split(/\s+/)[0];

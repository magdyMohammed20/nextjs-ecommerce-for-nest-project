export interface AvatarStyle {
  id: string;
  label: string;
  seeds: string[];
}

const SEED_POOL = [
  "Ava",
  "Alex",
  "Maya",
  "Noah",
  "Liam",
  "Zoe",
  "Leo",
  "Ella",
  "Max",
  "Ruby",
  "Ivy",
  "Omar",
  "Kai",
  "Mia",
  "Sam",
  "Nora",
  "Finn",
  "Luna",
  "Ivan",
  "Aria",
];

function makeSeeds(offset: number, count: number): string[] {
  return Array.from(
    { length: count },
    (_, i) => SEED_POOL[(offset + i) % SEED_POOL.length],
  );
}

export const AVATAR_STYLES: AvatarStyle[] = [
  { id: "adventurer", label: "Adventurer", seeds: makeSeeds(0, 12) },
  { id: "avataaars", label: "Avataaars", seeds: makeSeeds(3, 12) },
  { id: "bottts", label: "Bots", seeds: makeSeeds(6, 12) },
  { id: "croodles", label: "Doodles", seeds: makeSeeds(9, 12) },
  { id: "fun-emoji", label: "Emoji", seeds: makeSeeds(12, 12) },
  { id: "lorelei", label: "Lorelei", seeds: makeSeeds(15, 12) },
  { id: "micah", label: "Micah", seeds: makeSeeds(2, 12) },
  { id: "open-peeps", label: "Peeps", seeds: makeSeeds(5, 12) },
  { id: "pixel-art", label: "Pixel", seeds: makeSeeds(8, 12) },
  { id: "shapes", label: "Shapes", seeds: makeSeeds(11, 12) },
];

export function buildAvatarUrl(style: string, seed: string): string {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

export function getAvatarUrls(style: AvatarStyle): string[] {
  return style.seeds.map((seed) => buildAvatarUrl(style.id, seed));
}

export function getRandomAvatar(): string {
  const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
  const seed = style.seeds[Math.floor(Math.random() * style.seeds.length)];
  return buildAvatarUrl(style.id, seed);
}

// Per-nation card header colors, matching the actual color used on each nation's
// Army Tablet page and unit cards in the source PDF (sampled directly from the
// booklet: Britain's cards are red, France's are blue, Prussia's are navy, Russia's
// are dark green, Spain's are yellow, Turkey's are light green, and Austria's are
// the plain steel-gray used throughout the booklet's neutral UI chrome). All 14
// minor powers use the same near-black header the booklet gives every client state.

export interface NationColor {
  /** Base header fill color (a light-to-dark gradient is derived from this). */
  bg: string;
  /** Unit name text color. */
  text: string;
  /** Subtitle (foreign-contingent nation label) text color. */
  subtitle: string;
}

const NEUTRAL: NationColor = { bg: '#c9cdd1', text: '#1c1917', subtitle: '#57534e' };
const MINOR: NationColor = { bg: '#231f20', text: '#ffffff', subtitle: '#c9c5c5' };

const MAJOR_POWERS: Record<string, NationColor> = {
  austria: NEUTRAL,
  britain: { bg: '#c8212a', text: '#ffffff', subtitle: '#f3d3d5' },
  france: { bg: '#3969b1', text: '#ffffff', subtitle: '#d7e3f4' },
  'prussia-early': { bg: '#1c2a52', text: '#ffffff', subtitle: '#c7cfe1' },
  'prussia-late': { bg: '#1c2a52', text: '#ffffff', subtitle: '#c7cfe1' },
  russia: { bg: '#1a532b', text: '#ffffff', subtitle: '#c9dccb' },
  spain: { bg: '#fbe500', text: '#1c1917', subtitle: '#57534e' },
  turkey: { bg: '#7dcf73', text: '#16311a', subtitle: '#2f4a2d' },
};

/** Lighten (positive) or darken (negative) a hex color by a fraction of the way to white/black. */
function shade(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const mix = (c: number) => (amount >= 0 ? c + (255 - c) * amount : c * (1 + amount));
  const clamp = (c: number) => Math.max(0, Math.min(255, Math.round(c)));
  const toHex = (c: number) => clamp(c).toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

export function getNationColor(nationId?: string): NationColor {
  if (!nationId) return NEUTRAL;
  return MAJOR_POWERS[nationId] ?? MINOR;
}

/** A light-to-dark CSS gradient for the card header, built from the nation's base color. */
export function nationHeaderGradient(nationId?: string): string {
  const { bg } = getNationColor(nationId);
  return `linear-gradient(to bottom, ${shade(bg, 0.22)}, ${shade(bg, -0.14)})`;
}

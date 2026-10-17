// Every SVG diagram the site draws, by name, each a function of its layout.
// The rounds are drawn on a canvas instead (src/components/Rounds.astro).
import type { Layout } from './kit';
import { hero } from './hero';
import { exits } from './exits';
import { herdr } from './herdr';

export const diagrams: Record<string, (layout: Layout) => string> = {
  hero,
  exits,
  herdr,
};

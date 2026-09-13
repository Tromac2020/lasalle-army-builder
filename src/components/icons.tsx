// Card icon artwork — the official Lasalle rulebook's own icon set.
// Troy confirmed the rulebook author has given permission to use/customise
// the official templates and artwork for this project, so these are the
// actual game icons (extracted from the Army Maker PDF's embedded
// illustrations) rather than original hand-drawn recreations used in
// earlier drafts of this app.
import type { Trait } from '../data/cardProfiles';
import type { UnitKind } from '../data/types';

import infantryStandingImg from '../assets/cards/infantry-standing.png';
import cavalryImg from '../assets/cards/cavalry.png';
import artilleryImg from '../assets/cards/artillery.png';
import resolve3Img from '../assets/cards/resolve-3plus.png';
import resolve4Img from '../assets/cards/resolve-4plus.png';
import resolve5Img from '../assets/cards/resolve-5plus.png';
import resolve6Img from '../assets/cards/resolve-6.png';
import skirmish1Img from '../assets/cards/skirmish-1.png';
import skirmish2Img from '../assets/cards/skirmish-2.png';
import skirmish3Img from '../assets/cards/skirmish-3.png';
import riflesImg from '../assets/cards/rifles.png';
import shockCavImg from '../assets/cards/shock-cavalry.png';
import rapidFireImg from '../assets/cards/rapid-fire.png';
import weakFireImg from '../assets/cards/weak-fire.png';
import attackColumnsImg from '../assets/cards/attack-columns.png';
import lancersImg from '../assets/cards/lancers.png';
import resilientImg from '../assets/cards/resilient.png';
import heavyArtImg from '../assets/cards/heavy-artillery.png';
import horseArtImg from '../assets/cards/horse-artillery.png';
import rabbleImg from '../assets/cards/rabble.png';
import cavSkirmishersImg from '../assets/cards/cavalry-skirmishers.png';

/** A single image scaled to fit within a size x size box, preserving its native aspect ratio. */
function IconImg({ src, alt, size, title }: { src: string; alt: string; size: number; title?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
    />
  );
}

export function KindIcon({ kind, size = 22 }: { kind: UnitKind; size?: number }) {
  if (kind === 'cavalry') return <IconImg src={cavalryImg} alt="Cavalry" size={size} />;
  if (kind === 'artillery') return <IconImg src={artilleryImg} alt="Artillery" size={size} />;
  return <IconImg src={infantryStandingImg} alt="Infantry" size={size} />;
}

const RESOLVE_IMAGES: Record<string, string> = {
  '3+': resolve3Img,
  '4+': resolve4Img,
  '5+': resolve5Img,
  '6': resolve6Img,
};

export function ResolveBurst({ value, size = 30 }: { value: string; size?: number }) {
  const src = RESOLVE_IMAGES[value];
  if (!src) return null;
  return <IconImg src={src} alt={`Resolve ${value}`} size={size} />;
}

const SKIRMISH_IMAGES: Record<number, string> = {
  1: skirmish1Img,
  2: skirmish2Img,
  3: skirmish3Img,
};

export function SkirmishBadge({ value, size = 26 }: { value: number; size?: number }) {
  const numImg = SKIRMISH_IMAGES[value];
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      title={`Skirmish value ${value}`}
    >
      <IconImg src={infantryStandingImg} alt="Infantry" size={size} />
      {numImg && (
        <img
          src={numImg}
          alt={`${value}`}
          className="absolute -top-1 -right-2"
          style={{ height: size * 0.55, width: 'auto' }}
        />
      )}
    </div>
  );
}

const TRAIT_LABELS: Record<Trait, string> = {
  rifles: 'Rifles',
  attackColumns: 'Attack Columns',
  resilient: 'Resilient',
  rapidFire: 'Rapid Fire',
  weakFire: 'Weak Fire',
  rabble: 'Rabble',
  lancers: 'Lancers',
  shockCav: 'Shock Cavalry',
  cavSkirmishers: 'Cavalry Skirmishers',
  heavyArt: 'Heavy Artillery',
  horseArt: 'Horse Artillery',
};

export function traitLabel(t: Trait): string {
  return TRAIT_LABELS[t];
}

const TRAIT_IMAGES: Record<Trait, string> = {
  rifles: riflesImg,
  attackColumns: attackColumnsImg,
  resilient: resilientImg,
  rapidFire: rapidFireImg,
  weakFire: weakFireImg,
  rabble: rabbleImg,
  lancers: lancersImg,
  shockCav: shockCavImg,
  cavSkirmishers: cavSkirmishersImg,
  heavyArt: heavyArtImg,
  horseArt: horseArtImg,
};

export function TraitIcon({ trait, size = 24 }: { trait: Trait; size?: number }) {
  const src = TRAIT_IMAGES[trait];
  if (!src) return null;
  return <IconImg src={src} alt={traitLabel(trait)} title={traitLabel(trait)} size={size} />;
}

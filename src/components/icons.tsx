// Card icon artwork — the official Lasalle rulebook's own icon set.
// Troy confirmed the rulebook author has given permission to use/customise
// the official templates and artwork for this project, so these are the
// actual game icons (extracted from the Army Maker PDF's embedded
// illustrations) rather than original hand-drawn recreations used in
// earlier drafts of this app.
import { useId } from 'react';
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

/** A single small white die showing 5 pips, used to build the firepower dice cluster. */
function Die({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} 8 8)`}>
      <rect x="0" y="0" width="16" height="16" rx="2.5" fill="#fff" stroke="#2b2620" strokeWidth="1.7" />
      <circle cx="4.2" cy="4.2" r="1.5" fill="#2b2620" />
      <circle cx="11.8" cy="4.2" r="1.5" fill="#2b2620" />
      <circle cx="8" cy="8" r="1.5" fill="#2b2620" />
      <circle cx="4.2" cy="11.8" r="1.5" fill="#2b2620" />
      <circle cx="11.8" cy="11.8" r="1.5" fill="#2b2620" />
    </g>
  );
}

/**
 * The unit's firepower dice, matching the "number of dice symbols" the Army Maker
 * shows on each artillery card (p.19/61 of the rulebook — firepower dice count
 * varies by battery type, from 3 up to 5, and is NOT just a fixed generic pair).
 * Dice are laid out two per row, matching the source booklet's clustered icon.
 */
export function DicePair({ count = 2, size = 22 }: { count?: number; size?: number }) {
  const cols = 2;
  const rows = Math.ceil(count / cols);
  const cellW = 13;
  const cellH = 11;
  const dieSize = 16;
  const vbW = (cols - 1) * cellW + dieSize;
  const vbH = (rows - 1) * cellH + dieSize;
  const dice = Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    // stagger alternate rows slightly and vary rotation a touch, like the source art
    const x = col * cellW + (row % 2 === 1 ? 2 : 0);
    const y = row * cellH;
    const rotate = (i % 2 === 0 ? -8 : 8) + (row % 2 === 1 ? 4 : 0);
    return <Die key={i} x={x} y={y} rotate={rotate} />;
  });
  const w = size;
  const h = (size * vbH) / vbW;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${vbW + 2} ${vbH + 2}`}>
      {dice}
    </svg>
  );
}

/** The to-hit number with a soft red halo behind it, matching the artillery cards' fire-dice target. */
export function ToHitBadge({ value, size = 30 }: { value: string; size?: number }) {
  const gradId = `hitGlow-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0455a" stopOpacity="0.6" />
          <stop offset="55%" stopColor="#e0455a" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#e0455a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${gradId})`} />
      <text x="20" y="26" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1a1a1a" fontFamily="Arial, Helvetica, sans-serif">
        {value}
      </text>
    </svg>
  );
}

/** The point-cost badge: a metallic gold coin, matching the corner badge on every card. */
export function CostBadge({ value, size = 28 }: { value: number; size?: number }) {
  const gradId = `costGrad-${useId()}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#f6e6ab" />
          <stop offset="55%" stopColor="#d3a94a" />
          <stop offset="100%" stopColor="#96701f" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14.6" fill={`url(#${gradId})`} stroke="#5c421a" strokeWidth="1.4" />
      <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="800" fill="#2b1e08" fontFamily="Arial, Helvetica, sans-serif">
        {value}
      </text>
    </svg>
  );
}

// Small original SVG icons used on the printable unit cards. These are simple
// geometric renderings that convey the same information as the Army Maker
// booklet's card icons (a flag for Resilient, crossed blades for Attack
// Columns, etc.) — they are original artwork, not reproductions/traces of
// the source PDF's illustrations.
import type { Trait } from '../data/cardProfiles';
import type { UnitKind } from '../data/types';

const stroke = '#2b2620';

export function KindIcon({ kind, size = 22 }: { kind: UnitKind; size?: number }) {
  if (kind === 'cavalry') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 18l1.5-5c.3-1 1.1-1.8 2.1-2.1l2-.6c.4-1.6 1.8-3 3.6-3.3.2-.9 1-1.6 2-1.6.5 0 1 .2 1.3.5l.9-.4.4.9-.8.5c.1.3.1.6.1.9 0 .8-.4 1.5-1 1.9l1 4.6-1.7 3.7-1.4-.3.9-2.5-1-.3-1.6 3-1.5-.2.9-2.7-2.4.4L8 18.6 6.4 18l1-3.1-1.7.5L4 18z"
          stroke={stroke}
          strokeWidth="0.6"
          fill={stroke}
        />
      </svg>
    );
  }
  if (kind === 'artillery') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="15" r="2.4" stroke={stroke} strokeWidth="1.4" />
        <circle cx="17" cy="15" r="2.4" stroke={stroke} strokeWidth="1.4" />
        <rect x="4" y="9" width="15" height="3.4" rx="1.4" transform="rotate(-8 4 9)" fill={stroke} />
        <rect x="15" y="6" width="3" height="5" rx="0.5" fill={stroke} />
      </svg>
    );
  }
  // infantry
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="5.5" r="2.6" fill={stroke} />
      <path d="M12 8.5c-2.4 0-4.3 1.7-4.6 4L6 21h2.2l1-6 .8 1v6h1.8v-6.6l1 1.6v5h1.8v-6l1-1.6 1 6h2.2l-1.4-8.5c-.3-2.3-2.2-4-4.6-4z" fill={stroke} />
    </svg>
  );
}

export function ResolveBurst({ value, size = 30 }: { value: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path
        d="M20 1l3.4 5.6 6-2.8-.6 6.6 6.6.9-4 5.3 4 5.3-6.6.9.6 6.6-6-2.8L20 39l-3.4-5.6-6 2.8.6-6.6-6.6-.9 4-5.3-4-5.3 6.6-.9-.6-6.6 6 2.8L20 1z"
        fill="#c0392b"
        stroke="#7a1f16"
        strokeWidth="0.6"
      />
      <text x="20" y="24" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily="Georgia, serif">
        {value}
      </text>
    </svg>
  );
}

export function SkirmishBadge({ value, size = 26 }: { value: number; size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      title={`Skirmish value ${value}`}
    >
      <KindIcon kind="infantry" size={size} />
      <span
        className="absolute -top-1 -right-1 bg-amber-400 text-black text-[9px] font-bold rounded-full leading-none flex items-center justify-center border border-black/60"
        style={{ width: 12, height: 12 }}
      >
        {value}
      </span>
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

export function TraitIcon({ trait, size = 20 }: { trait: Trait; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24' } as const;
  switch (trait) {
    case 'resilient':
      return (
        <svg {...common}>
          <line x1="5" y1="2" x2="5" y2="22" stroke={stroke} strokeWidth="1.6" />
          <path d="M5 3l13 3-13 4V3z" fill="#e8e0cf" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case 'attackColumns':
      return (
        <svg {...common}>
          <line x1="4" y1="4" x2="20" y2="20" stroke={stroke} strokeWidth="2" />
          <line x1="20" y1="4" x2="4" y2="20" stroke={stroke} strokeWidth="2" />
          <circle cx="4" cy="4" r="1.6" fill={stroke} />
          <circle cx="20" cy="4" r="1.6" fill={stroke} />
        </svg>
      );
    case 'rapidFire':
      return (
        <svg {...common}>
          <line x1="3" y1="18" x2="15" y2="8" stroke={stroke} strokeWidth="2.2" />
          <rect x="13.5" y="5.5" width="4" height="4" rx="0.6" fill={stroke} transform="rotate(45 15.5 7.5)" />
          <path d="M17 6l4-2M19 8l3.5-.5" stroke={stroke} strokeWidth="1.4" />
        </svg>
      );
    case 'rifles':
      return (
        <svg {...common}>
          <rect x="2" y="15.5" width="15" height="2.2" rx="0.4" transform="rotate(-18 2 15.5)" fill={stroke} />
          <rect x="14.5" y="6.5" width="2.4" height="6" rx="0.3" transform="rotate(-18 14.5 6.5)" fill={stroke} />
          <rect x="3" y="17.5" width="4.5" height="2" rx="0.3" transform="rotate(-18 3 17.5)" fill={stroke} />
        </svg>
      );
    case 'weakFire':
      return (
        <svg {...common}>
          <path d="M6 16a3.5 3.5 0 0 1-.5-6.9A4.5 4.5 0 0 1 14 8a3.8 3.8 0 0 1 4 3.8A3.7 3.7 0 0 1 17.5 16H6z" fill="#dcdcdc" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case 'rabble':
      return (
        <svg {...common}>
          <line x1="6" y1="3" x2="6" y2="21" stroke={stroke} strokeWidth="1.4" />
          <line x1="12" y1="3" x2="12" y2="21" stroke={stroke} strokeWidth="1.4" />
          <line x1="18" y1="3" x2="18" y2="21" stroke={stroke} strokeWidth="1.4" />
          <path d="M4 4l4 2-4 2M10 6l4 2-4 2M16 5l4 2-4 2" fill="none" stroke={stroke} strokeWidth="1.1" />
        </svg>
      );
    case 'lancers':
      return (
        <svg {...common}>
          <line x1="3" y1="12" x2="21" y2="12" stroke="#d4a017" strokeWidth="2.4" />
          <path d="M3 12l6-4v8l-6-4z" fill="#d4a017" />
        </svg>
      );
    case 'shockCav':
      return (
        <svg {...common}>
          <path d="M4 18l1-4c.2-1 1-1.8 2-2l1.5-.5c.2-1.6 1.6-3 3.4-3.2.1-.8.8-1.4 1.7-1.4.6 0 1.1.3 1.4.7l1-.3.3.9-.9.4c.1.2.1.5.1.7 0 .7-.4 1.4-1 1.7l.9 4-1.4 3-1.1-.2.7-2-1.6-.3-1.2 2.6-1.2-.2.7-2.3-2 .3L7 18.5 5.6 18l.8-2.4-1.6.4L4 18z" fill={stroke} />
        </svg>
      );
    case 'cavSkirmishers':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" fill="none" stroke={stroke} strokeWidth="1.4" strokeDasharray="3 2" />
          <circle cx="12" cy="12" r="2.4" fill={stroke} />
        </svg>
      );
    case 'heavyArt':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" fill="#1a1a1a" />
        </svg>
      );
    case 'horseArt':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" fill="none" stroke={stroke} strokeWidth="1.6" />
          <circle cx="12" cy="12" r="1.6" fill={stroke} />
          {[0, 60, 120].map((deg) => (
            <line
              key={deg}
              x1={12 - 8 * Math.cos((deg * Math.PI) / 180)}
              y1={12 - 8 * Math.sin((deg * Math.PI) / 180)}
              x2={12 + 8 * Math.cos((deg * Math.PI) / 180)}
              y2={12 + 8 * Math.sin((deg * Math.PI) / 180)}
              stroke={stroke}
              strokeWidth="1.2"
            />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

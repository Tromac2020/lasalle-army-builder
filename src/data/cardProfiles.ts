// Card-rendering stat profiles for the Lasalle Second Edition "Army Tablet" cards
// (Army Maker v1.22, pages 14-58). These are ADDITIONAL display-only fields —
// point costs themselves already live in nations.ts and are never recomputed
// here. Track/resolve/skirmish/trait values were read directly off each
// nation's printed unit card and cross-checked against the "Open Architecture"
// point formula on pages 60-61 (base track+resolve cost, +/- per trait).
//
// Icon artwork used to render these fields (see icons.tsx) is original —
// simple geometric shapes conveying the same info as the booklet's icons
// (a flag for Resilient, crossed blades for Attack Columns, etc.) — not
// reproductions of the PDF's artwork.

import type { UnitKind } from './types';

export type Trait =
  | 'rifles'
  | 'attackColumns'
  | 'resilient'
  | 'rapidFire'
  | 'weakFire'
  | 'rabble'
  | 'lancers'
  | 'shockCav'
  | 'cavSkirmishers'
  | 'heavyArt'
  | 'horseArt';

export interface CardProfile {
  kind: UnitKind;
  /** Skirmish value shown on the unit's soldier/skirmisher badge (infantry, and light cavalry types). */
  skirmish?: number;
  /** Resolve threshold, e.g. "5+", "4+", "3+". Artillery always shows a plain "6". */
  resolve: string;
  /** Strength track boxes, left (fresh) to right (nearly destroyed). */
  track: number[];
  /** How many boxes at the low end of the track are shaded (the "shaken" zone). */
  shaken: number;
  traits: Trait[];
  /** Artillery only: the To-Hit number, e.g. "4+" or "5+". */
  toHit?: string;
  /** Artillery only: number of firepower dice shown (from the "Open Architecture" firepower/cost table, p.61). */
  firepower?: number;
}

interface LevelDef {
  track: number[];
  shaken: number;
  resolve: string;
}

const INF_LEVELS: Record<number, LevelDef> = {
  1: { track: [7, 6, 5, 4, 3, 2, 1], shaken: 2, resolve: '5+' },
  2: { track: [6, 5, 4, 3, 2, 1], shaken: 2, resolve: '5+' },
  3: { track: [6, 5, 4, 3, 2, 1], shaken: 2, resolve: '4+' },
  4: { track: [6, 5, 4, 3, 2, 1], shaken: 3, resolve: '4+' },
  5: { track: [6, 5, 4, 3, 2, 1], shaken: 3, resolve: '3+' },
  6: { track: [5, 4, 3, 2, 1], shaken: 3, resolve: '3+' },
};

const CAV_LEVELS: Record<number, LevelDef> = {
  1: { track: [7, 6, 5, 4, 3, 2, 1], shaken: 2, resolve: '5+' },
  2: { track: [6, 5, 4, 3, 2, 1], shaken: 2, resolve: '5+' },
  3: { track: [6, 5, 4, 3, 2, 1], shaken: 2, resolve: '4+' },
  4: { track: [5, 4, 3, 2, 1], shaken: 2, resolve: '4+' },
  5: { track: [5, 4, 3, 2, 1], shaken: 2, resolve: '3+' },
};

function inf(level: number, skirmish: number, traits: Trait[] = []): CardProfile {
  const l = INF_LEVELS[level];
  return { kind: 'infantry', skirmish, resolve: l.resolve, track: l.track, shaken: l.shaken, traits };
}

function cav(level: number, traits: Trait[] = [], skirmish?: number): CardProfile {
  const l = CAV_LEVELS[level];
  return { kind: 'cavalry', skirmish, resolve: l.resolve, track: l.track, shaken: l.shaken, traits };
}

function art(toHit: string, firepower: number, traits: Trait[] = []): CardProfile {
  return { kind: 'artillery', resolve: '6', track: [2, 1], shaken: 1, toHit, firepower, traits };
}

/** Keyed by `${nationId}:${name}` exactly as `name` appears in nations.ts units[]. */
export const PROFILES: Record<string, CardProfile> = {
  // ---------------------------------------------------------------- Austria
  'austria:Grenadier': inf(3, 2, ['attackColumns', 'resilient']),
  'austria:Grenz': inf(3, 3),
  'austria:Musketeer (veteran)': inf(3, 2),
  'austria:Musketeer (conscript)': inf(4, 2),
  'austria:Landwehr': inf(6, 1, ['weakFire']),
  'austria:Jäger': inf(3, 3, ['rifles']),
  'austria:Cuirassier': cav(1, ['shockCav']),
  'austria:Dragoon & Cheveauleger': cav(2),
  'austria:Uhlan': cav(2, ['lancers']),
  'austria:Hussar': cav(1),
  'austria:Insurrection Cavalry': cav(5, ['cavSkirmishers'], 1),
  'austria:Light Brigade Battery': art('5+', 4),
  'austria:Brigade Battery': art('4+', 4),
  'austria:Heavy Position Battery': art('4+', 3, ['heavyArt']),
  'austria:Position Battery': art('4+', 3),
  'austria:Cavalry Battery': art('4+', 3, ['horseArt']),

  // ---------------------------------------------------------------- Britain
  'britain:Foot Guard': inf(1, 3, ['rapidFire', 'resilient']),
  'britain:Rifle Regiment': inf(1, 3, ['rifles']),
  'britain:Foot Regiment (elite)': inf(2, 3, ['rapidFire', 'resilient']),
  'britain:Foot Regiment (veteran)': inf(3, 3, ['rapidFire', 'resilient']),
  'britain:Foot Regiment (conscript)': inf(3, 3),
  'britain:Hanoverian Militia': inf(6, 2),
  'britain:Guard & Dragoons': cav(1, ['shockCav']),
  'britain:Lt. Dragoon & Hussar': cav(2),
  'britain:Foot Artillery': art('4+', 3),
  'britain:Horse Artillery': art('4+', 3, ['horseArt']),
  'britain:Rocket Troop': art('5+', 3, ['horseArt']),

  // ----------------------------------------------------------------- France
  'france:Old Guard Infantry': inf(1, 3, ['attackColumns', 'resilient']),
  'france:Infantry (elite)': inf(2, 3, ['attackColumns']),
  'france:Infantry (veteran)': inf(3, 3, ['attackColumns']),
  'france:Infantry (conscript)': inf(4, 3, ['attackColumns']),
  'france:Old Guard Cavalry': cav(1, ['shockCav', 'resilient']),
  'france:Old Guard Cavalry (lancer)': cav(1, ['shockCav', 'resilient', 'lancers']),
  'france:Cuirassier or Carabinier': cav(1, ['shockCav']),
  'france:Dragoon': cav(1),
  'france:Lancer': cav(2, ['lancers']),
  'france:Hussar or Chasseur': cav(2),
  'france:Heavy Cavalry (1813-14)': cav(2),
  'france:Light Cavalry (1813-14)': cav(3),
  'france:Light Cavalry (1813-14, Lancer)': cav(3, ['lancers']),
  'france:Young Gd. Cavalry (1813-14)': cav(2),
  'france:Field Artillery': art('4+', 4),
  'france:Reserve Artillery': art('4+', 4, ['heavyArt']),
  'france:Horse Artillery': art('4+', 3, ['horseArt']),
  'france:Old Gd. Reserve Artillery': art('4+', 5, ['heavyArt']),
  'france:Old Gd. Horse Artillery': art('4+', 4, ['horseArt']),

  // ------------------------------------------------------- Prussia (early)
  'prussia-early:Grenadier & Garde zu Fuß': inf(1, 1, ['rapidFire']),
  'prussia-early:Musketeer': inf(3, 1, ['rapidFire']),
  'prussia-early:Fusilier': inf(3, 2, ['rapidFire']),
  'prussia-early:Schützen': inf(3, 3, ['rifles']),
  'prussia-early:Cuirassier': cav(1, ['shockCav']),
  'prussia-early:Dragoon': cav(1),
  'prussia-early:Hussar': cav(1),
  'prussia-early:Uhlan': cav(2, ['lancers']),
  'prussia-early:Field Artillery': art('4+', 4),
  'prussia-early:Heavy Artillery': art('4+', 4, ['heavyArt']),
  'prussia-early:Horse Artillery': art('4+', 4, ['horseArt']),

  // -------------------------------------------------------- Prussia (late)
  'prussia-late:Grenadiers & Garde zu Fuß': inf(2, 2, ['attackColumns']),
  'prussia-late:Fusilier': inf(3, 3, ['attackColumns']),
  'prussia-late:Musketeers & Reserve INF': inf(3, 3, ['attackColumns']),
  'prussia-late:Schützen': inf(3, 3, ['rifles']),
  'prussia-late:Landwehr (veteran)': inf(4, 2, ['attackColumns']),
  'prussia-late:Landwehr (conscript)': inf(5, 2),
  'prussia-late:Cuirassier': cav(1, ['shockCav']),
  'prussia-late:Dragoon or Hussar': cav(2),
  'prussia-late:Uhlan': cav(2, ['lancers']),
  'prussia-late:Landwehr Cavalry': cav(4, ['lancers']),
  'prussia-late:Field Artillery': art('4+', 4),
  'prussia-late:Horse Artillery': art('4+', 4, ['horseArt']),
  'prussia-late:Heavy Artillery': art('4+', 4, ['heavyArt']),
  'prussia-late:Howitzer': art('4+', 3),

  // ----------------------------------------------------------------- Russia
  'russia:Guard Infantry': inf(1, 2, ['resilient']),
  'russia:Grenadier': inf(2, 2, ['resilient']),
  'russia:Musketeer (veteran)': inf(3, 2, ['resilient']),
  'russia:Musketeer (conscript)': inf(4, 2, ['resilient']),
  'russia:Jäger': inf(4, 3),
  'russia:Opolchenie': inf(6, 1, ['weakFire', 'rabble']),
  'russia:Cuirassier, Guard Cavalry': cav(1, ['shockCav']),
  'russia:Dragoon, Mtd. Jäger': cav(2),
  'russia:Hussar': cav(1),
  'russia:Uhlan': cav(2, ['lancers']),
  'russia:Cossack': cav(5, ['cavSkirmishers'], 1),
  'russia:Foot Battery': art('4+', 5),
  'russia:Horse Battery': art('4+', 5, ['horseArt']),
  'russia:Heavy Battery': art('4+', 5, ['heavyArt']),

  // ------------------------------------------------------------------ Spain
  'spain:Elite Regiment': inf(3, 2),
  'spain:Infantry (regular)': inf(4, 2, ['weakFire']),
  'spain:Grenadier': inf(3, 1),
  'spain:Infantry (provincial)': inf(5, 1, ['weakFire']),
  'spain:Infantry (militia)': inf(6, 1, ['weakFire', 'rabble']),
  'spain:Guard or Elite Cavalry': cav(3),
  'spain:Dragoons or Hussars': cav(4),
  'spain:Guerilla Cavalry': cav(5, ['cavSkirmishers'], 1),
  'spain:Heavy Battery': art('4+', 3, ['heavyArt']),
  'spain:Foot Battery': art('5+', 3),

  // ----------------------------------------------------------------- Turkey
  'turkey:Nizam i Çedid': inf(3, 1),
  'turkey:Janissary (veteran)': inf(4, 2, ['weakFire']),
  'turkey:Militia': inf(6, 1, ['weakFire', 'rabble']),
  'turkey:Janissary (conscript)': inf(5, 2, ['weakFire']),
  'turkey:Household Cavalry': cav(1),
  'turkey:Kapikulu Cavalry': cav(3),
  'turkey:Sipahis': cav(5, ['cavSkirmishers', 'lancers'], 1),
  'turkey:Mobile Battery': art('5+', 4, ['horseArt']),
  'turkey:Heavy Artillery': art('5+', 4, ['heavyArt']),
  'turkey:Field Battery': art('5+', 4),

  // --------------------------------------------------------------- Bavaria
  'bavaria:Infantry (veteran)': inf(3, 2),
  'bavaria:Infantry (conscript)': inf(4, 2),
  'bavaria:All Infantry (1813)': inf(5, 2),
  'bavaria:Light Battalion': inf(3, 3),
  'bavaria:Cavalry': cav(2),
  'bavaria:Foot Battery': art('4+', 3),
  'bavaria:Heavy Battery': art('4+', 3, ['heavyArt']),
  'bavaria:"Light" Battery': art('4+', 3, ['horseArt']),

  // ------------------------------------------------------------- Brunswick
  'brunswick:1806 Light Battalion': inf(3, 3),
  'brunswick:1806 Infantry': inf(3, 1),
  'brunswick:1815 Infantry (veteran)': inf(3, 3),
  'brunswick:1815 Infantry (conscript)': inf(4, 3),
  'brunswick:Infantry (1809-1814)': inf(3, 3),
  'brunswick:Light Cavalry': cav(2),
  'brunswick:Foot Battery': art('4+', 3),
  'brunswick:Horse Battery': art('4+', 3, ['horseArt']),

  // -------------------------------------------------- Confederation of the Rhine
  'confederation:Infantry (elite)': inf(2, 2),
  'confederation:Infantry (veteran)': inf(3, 2),
  'confederation:Infantry (conscript)': inf(4, 2),
  'confederation:Light Battalion': inf(3, 3),
  'confederation:Cavalry': cav(2),
  'confederation:Foot Battery': art('4+', 4),
  'confederation:Horse Battery': art('4+', 3, ['horseArt']),

  // --------------------------------------------------------------- Denmark
  'denmark:Jäger': inf(3, 3),
  'denmark:Infantry': inf(4, 2),
  'denmark:Militia': inf(5, 1, ['weakFire']),
  'denmark:Ryterre': cav(2),
  'denmark:Hussar or Lt. Dragoon': cav(3),
  'denmark:Foot Battery': art('4+', 4),
  'denmark:Horse Battery': art('4+', 4, ['horseArt']),

  // ---------------------------------------------------------------- Holland
  'holland:Infantry (veteran)': inf(3, 3),
  'holland:Infantry (conscript)': inf(4, 2),
  'holland:Light Cavalry': cav(2),
  'holland:Cuirassier': cav(1, ['shockCav']),
  'holland:Foot Battery': art('4+', 4),
  'holland:Horse Battery': art('4+', 3, ['horseArt']),

  // ------------------------------------------------------------------ Italy
  'italy:Infantry (guard)': inf(2, 3),
  'italy:Infantry (veteran or light)': inf(3, 3),
  'italy:Infantry (conscript)': inf(4, 2),
  'italy:Guard Cavalry': cav(1),
  'italy:Dragoons & Lt. Cav': cav(2),
  'italy:Reserve Battery': art('4+', 4, ['heavyArt']),
  'italy:Foot Battery': art('4+', 4),
  'italy:Horse Battery': art('4+', 3, ['horseArt']),

  // ----------------------------------------------------------------- Naples
  'naples:Infantry (guard)': inf(4, 2),
  'naples:Infantry (line or light)': inf(5, 2),
  'naples:All Infantry (1813-15)': inf(6, 2),
  'naples:Guard Cavalry': cav(3),
  'naples:Cavalry': cav(4),
  'naples:Reserve Battery': art('4+', 4, ['heavyArt']),
  'naples:Foot Battery': art('4+', 4),
  'naples:Horse Battery': art('4+', 3, ['horseArt']),

  // ------------------------------------------------ Kingdom of the Netherlands (1815)
  'netherlands1815:Infantry': inf(4, 3),
  'netherlands1815:Militia': inf(5, 2),
  'netherlands1815:Cavalry': cav(3),
  'netherlands1815:Foot Battery': art('4+', 3),
  'netherlands1815:Horse Battery': art('4+', 3, ['horseArt']),

  // --------------------------------------------------------------- Portugal
  'portugal:Infantry (veteran)': inf(3, 3),
  'portugal:Infantry (conscript)': inf(4, 3),
  'portugal:Caçadores': inf(3, 3),
  'portugal:Cavalry': cav(5),
  'portugal:Foot Artillery': art('4+', 3),

  // ----------------------------------------------------- Poland (Duchy of Warsaw)
  'poland:Infantry (veteran)': inf(3, 3, ['attackColumns']),
  'poland:Infantry (conscript)': inf(4, 3, ['attackColumns']),
  'poland:Light Cavalry': cav(2),
  'poland:Cuirassier': cav(1),
  'poland:Lancer': cav(1, ['lancers']),
  'poland:Reserve Battery': art('4+', 4, ['heavyArt']),
  'poland:Foot Battery': art('4+', 4),
  'poland:Horse Battery': art('4+', 3, ['horseArt']),

  // ---------------------------------------------------------------- Saxony
  'saxony:Guard or Grenadier': inf(3, 1),
  'saxony:Light Battalion': inf(3, 3),
  'saxony:Infantry (1805-7)': inf(4, 1),
  'saxony:Infantry (1808-12)': inf(4, 2),
  'saxony:All Infantry (1813)': inf(5, 2),
  'saxony:Light Cavalry': cav(2),
  'saxony:Heavy Cavalry': cav(1, ['shockCav']),
  'saxony:Foot Battery': art('4+', 3),
  'saxony:Horse Battery': art('4+', 3, ['horseArt']),
  'saxony:Heavy Battery': art('4+', 3, ['heavyArt']),

  // ---------------------------------------------------------------- Sweden
  'sweden:Guard Infantry': inf(3, 2),
  'sweden:Värvade': inf(4, 2),
  'sweden:Indelta Infantry': inf(5, 2),
  'sweden:Life Guards': cav(3),
  'sweden:Indelta Cavalry': cav(3),
  'sweden:Reserve Battery': art('4+', 4, ['heavyArt']),
  'sweden:Foot Battery': art('4+', 4),
  'sweden:Horse Battery': art('4+', 3, ['horseArt']),

  // ------------------------------------------------------------- Westphalia
  'westphalia:Guard Infantry': inf(3, 2),
  'westphalia:Jäger Carabinier BN': inf(4, 3, ['rifles']),
  'westphalia:Line Infantry': inf(4, 2),
  'westphalia:Light Battalion': inf(4, 3),
  'westphalia:All Infantry (1813)': inf(5, 2),
  'westphalia:Cuirassier': cav(1, ['shockCav']),
  'westphalia:Cheveauleger': cav(3, ['lancers']),
  'westphalia:Hussar': cav(3),
  'westphalia:Reserve Battery': art('4+', 4, ['heavyArt']),
  'westphalia:Foot Battery': art('4+', 4),
  'westphalia:Horse Battery': art('4+', 3, ['horseArt']),

  // ----------------------------------------------------------- Württemberg
  'wurttemberg:Infantry': inf(3, 2),
  'wurttemberg:Light Battalion': inf(3, 3),
  'wurttemberg:Infantry (1813)': inf(5, 2),
  'wurttemberg:Cavalry': cav(2),
  'wurttemberg:Foot Battery': art('4+', 4),
  'wurttemberg:Horse Battery': art('4+', 3, ['horseArt']),
};

/**
 * Army-asset lists sometimes give a unit an abbreviated / slightly different
 * display name than its own tablet entry (e.g. "Hvy. Position BTY" vs.
 * "Heavy Position Battery"). Both refer to the exact same printed card, so
 * we alias the asset's key to the canonical tablet key rather than duplicate
 * the data.
 */
const ALIASES: Record<string, string> = {
  'austria:Hvy. Position BTY': 'austria:Heavy Position Battery',
  'austria:Position BTY': 'austria:Position Battery',

  'britain:Rifle regiment': 'britain:Rifle Regiment',
  'britain:Brunswick Infantry': 'brunswick:Infantry (1809-1814)',
  'britain:Brunswick Cavalry': 'brunswick:Light Cavalry',
  'britain:Portuguese Cavalry': 'portugal:Cavalry',
  'britain:Portuguese Caçadore': 'portugal:Caçadores',

  'france:Reserve Art': 'france:Reserve Artillery',
  'france:Field Art': 'france:Field Artillery',
  'france:Horse Art': 'france:Horse Artillery',
  'france:Old Guard Horse Art': 'france:Old Gd. Horse Artillery',
  'france:Old Guard Reserve Art': 'france:Old Gd. Reserve Artillery',

  'prussia-early:Heavy Art': 'prussia-early:Heavy Artillery',
  'prussia-early:Field Art': 'prussia-early:Field Artillery',
  'prussia-early:Horse Art': 'prussia-early:Horse Artillery',

  'prussia-late:Grenadier': 'prussia-late:Grenadiers & Garde zu Fuß',
  'prussia-late:Heavy Art': 'prussia-late:Heavy Artillery',
  'prussia-late:Field Art': 'prussia-late:Field Artillery',
  'prussia-late:Horse Art': 'prussia-late:Horse Artillery',
  'prussia-late:Howitzer BTY': 'prussia-late:Howitzer',

  'russia:Heavy BTY': 'russia:Heavy Battery',
  'russia:Foot BTY': 'russia:Foot Battery',

  'spain:Heavy BTY': 'spain:Heavy Battery',
  'spain:Foot BTY': 'spain:Foot Battery',

  'turkey:Heavy BTY': 'turkey:Heavy Artillery',
  'turkey:Field BTY': 'turkey:Field Battery',

  'bavaria:Heavy BTY': 'bavaria:Heavy Battery',
  'bavaria:Foot BTY': 'bavaria:Foot Battery',

  'italy:Foot BTY': 'italy:Foot Battery',
  'italy:Reserve BTY': 'italy:Reserve Battery',

  'naples:Foot BTY': 'naples:Foot Battery',
  'naples:Reserve BTY': 'naples:Reserve Battery',

  'poland:Foot BTY': 'poland:Foot Battery',
  'poland:Reserve BTY': 'poland:Reserve Battery',

  'saxony:Foot BTY': 'saxony:Foot Battery',
  'saxony:Heavy BTY': 'saxony:Heavy Battery',

  'sweden:Foot BTY': 'sweden:Foot Battery',

  'westphalia:Reserve BTY': 'westphalia:Reserve Battery',

  'wurttemberg:Foot BTY': 'wurttemberg:Foot Battery',
};

export function getCardProfile(nationId: string, name: string): CardProfile | undefined {
  const key = `${nationId}:${name}`;
  return PROFILES[key] ?? (ALIASES[key] ? PROFILES[ALIASES[key]] : undefined);
}

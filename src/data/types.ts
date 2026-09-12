// Data model for the Lasalle 2nd Edition "Army Maker" booklet.
// See /docs or the project notes for how this maps to the source PDF.

export type UnitKind = 'infantry' | 'cavalry' | 'artillery';

export interface Unit {
  /** Unique within a nation's tablet, exactly as printed (subtype in parens if any). */
  name: string;
  kind: UnitKind;
  /** Points cost. null = not specified anywhere in the Army Maker booklet (Sapeur/ADC/Partisans) — user sets it. */
  cost: number | null;
  dates?: string;
  advanced?: boolean;
  notes?: string;
}

export interface BrigadeLine {
  min: number;
  max: number;
  /** Unit names (must exist in the owning nation's unit list). Multiple = "or" logic. */
  options: string[];
  note?: string;
}

export type Corps = 'line' | 'elite' | 'either';
export type BrigadeCategory = 'organic' | 'reserve';

export interface Brigade {
  id: string;
  name: string;
  category: BrigadeCategory;
  corps: Corps;
  essential?: boolean;
  armyMax?: number;
  dates?: string;
  lines: BrigadeLine[];
}

export interface Asset {
  name: string;
  min: number;
  max: number;
  cost: number | null;
  kind: UnitKind | 'special';
  advanced?: boolean;
  dates?: string;
  restriction?: string;
}

export interface AssetGroup {
  /** When a nation has separate asset lists per corps (France: line vs Guard). */
  corps?: Corps;
  maxAttachPerBrigade: number;
  assets: Asset[];
}

export interface Earthworks {
  maxSections: number;
  costPerSection: number;
}

export interface HistoricalParameters {
  atWar?: string;
  allies?: string;
  enemies?: string;
  clients?: string;
  clientOf?: string;
  eliteCorps?: string;
  notes?: string;
}

export interface Nation {
  id: string;
  name: string;
  powerType: 'major' | 'minor';
  noIndependentArmy?: boolean;
  hasEliteLineSplit?: boolean;
  historicalParameters: HistoricalParameters;
  units: Unit[];
  brigades: Brigade[];
  assetGroups: AssetGroup[];
  earthworks?: Earthworks;
  bookNotes?: string[];
}

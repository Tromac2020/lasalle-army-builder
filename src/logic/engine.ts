import type { Nation, Brigade, Corps } from '../data/types';
import { getNation, findUnit } from '../data/nations';

export { getNation } from '../data/nations';

export type LineSelection = Record<string, number>; // option name -> count

export interface AttachedAsset {
  name: string;
  count: number;
}

export interface BrigadeInstance {
  id: string;
  nationId: string;
  brigadeId: string;
  isForeign: boolean;
  lineSelections: LineSelection[];
  attachedAssets: AttachedAsset[];
}

export interface ComboUnit {
  name: string;
  count: number;
}

export interface ComboBrigade {
  id: string;
  nationId: string; // the asset's home nation (always the player's own nation — no foreign assets)
  units: ComboUnit[];
}

export interface ArmyState {
  nationId: string | null;
  corps: Corps | null; // 'line' | 'elite', only meaningful if nation.hasEliteLineSplit
  pointLimit: number;
  brigades: BrigadeInstance[];
  comboBrigades: ComboBrigade[];
  earthworksSections: number;
  assetCostOverrides: Record<string, number>; // for units with cost === null (Sapeur/ADC/Partisans)
}

export function newArmy(): ArmyState {
  return {
    nationId: null,
    corps: null,
    pointLimit: 300,
    brigades: [],
    comboBrigades: [],
    earthworksSections: 0,
    assetCostOverrides: {},
  };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Resolve the point cost of a unit by name within a nation, falling back to the army's override for null-cost items. */
export function unitCost(nationId: string, unitName: string, army: ArmyState): number {
  const nation = getNation(nationId);
  if (!nation) return 0;
  const u = findUnit(nation, unitName);
  if (!u) return 0;
  if (u.cost === null) return army.assetCostOverrides[`${nationId}:${unitName}`] ?? 0;
  return u.cost;
}

export function assetCost(nationId: string, assetName: string, cost: number | null, army: ArmyState): number {
  if (cost === null) return army.assetCostOverrides[`${nationId}:${assetName}`] ?? 0;
  return cost;
}

export function getBrigadeDef(nationId: string, brigadeId: string): Brigade | undefined {
  const nation = getNation(nationId);
  return nation?.brigades.find((b) => b.id === brigadeId);
}

export function lineTotal(sel: LineSelection): number {
  return Object.values(sel).reduce((a, b) => a + b, 0);
}

export function brigadeUnitCost(bi: BrigadeInstance, army: ArmyState): number {
  let total = 0;
  for (const sel of bi.lineSelections) {
    for (const [name, count] of Object.entries(sel)) {
      total += count * unitCost(bi.nationId, name, army);
    }
  }
  return total;
}

export function brigadeAssetCost(bi: BrigadeInstance, army: ArmyState, nation: Nation): number {
  let total = 0;
  for (const a of bi.attachedAssets) {
    const assetDef = findAssetDef(nation, a.name);
    total += a.count * assetCost(bi.nationId, a.name, assetDef?.cost ?? null, army);
  }
  return total;
}

export function findAssetDef(nation: Nation, name: string) {
  for (const g of nation.assetGroups) {
    const a = g.assets.find((x) => x.name === name);
    if (a) return a;
  }
  return undefined;
}

export function brigadeTotalCost(bi: BrigadeInstance, army: ArmyState): number {
  const nation = getNation(bi.nationId);
  if (!nation) return 0;
  return brigadeUnitCost(bi, army) + brigadeAssetCost(bi, army, nation);
}

export function comboBrigadeCost(cb: ComboBrigade, army: ArmyState, nation: Nation): number {
  let total = 0;
  for (const u of cb.units) {
    const assetDef = findAssetDef(nation, u.name);
    total += u.count * assetCost(cb.nationId, u.name, assetDef?.cost ?? null, army);
  }
  return total;
}

export function earthworksCost(army: ArmyState): number {
  const nation = army.nationId ? getNation(army.nationId) : undefined;
  if (!nation?.earthworks) return 0;
  return army.earthworksSections * nation.earthworks.costPerSection;
}

export function totalArmyCost(army: ArmyState): number {
  let total = 0;
  for (const bi of army.brigades) total += brigadeTotalCost(bi, army);
  const nation = army.nationId ? getNation(army.nationId) : undefined;
  if (nation) {
    for (const cb of army.comboBrigades) total += comboBrigadeCost(cb, army, nation);
  }
  total += earthworksCost(army);
  return total;
}

/** Total units used (attached + combined) of a given home-nation asset, army-wide. */
export function assetUsageTotal(army: ArmyState, assetName: string): number {
  let total = 0;
  for (const bi of army.brigades) {
    if (bi.isForeign) continue;
    for (const a of bi.attachedAssets) if (a.name === assetName) total += a.count;
  }
  for (const cb of army.comboBrigades) {
    for (const u of cb.units) if (u.name === assetName) total += u.count;
  }
  return total;
}

/** Attached asset count for one specific brigade instance (for the per-brigade attach cap). */
export function brigadeAssetUsage(bi: BrigadeInstance): number {
  return bi.attachedAssets.reduce((a, b) => a + b.count, 0);
}

export interface ValidationIssue {
  level: 'error' | 'warning';
  message: string;
}

export function validateArmy(army: ArmyState): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!army.nationId) return issues;
  const nation = getNation(army.nationId);
  if (!nation) return issues;

  if (nation.hasEliteLineSplit && !army.corps) {
    issues.push({ level: 'error', message: 'Choose whether this is a Line Corps or Elite Corps army.' });
  }

  // Per-brigade checks
  const armyMaxCounts: Record<string, number> = {};
  for (const bi of army.brigades) {
    const def = getBrigadeDef(bi.nationId, bi.brigadeId);
    if (!def) continue;
    const key = `${bi.nationId}:${bi.brigadeId}`;
    armyMaxCounts[key] = (armyMaxCounts[key] ?? 0) + 1;

    const total = bi.lineSelections.reduce((a, s) => a + lineTotal(s), 0);
    if (total < 2) {
      issues.push({ level: 'error', message: `${def.name}${bi.isForeign ? ` (${getNation(bi.nationId)?.name})` : ''}: needs at least 2 units (has ${total}).` });
    }
    def.lines.forEach((line, i) => {
      const sel = bi.lineSelections[i] ?? {};
      const t = lineTotal(sel);
      if (t < line.min || t > line.max) {
        issues.push({
          level: 'error',
          message: `${def.name}${bi.isForeign ? ` (${getNation(bi.nationId)?.name})` : ''}: "${line.options.join(' or ')}" needs ${line.min}-${line.max}, has ${t}.`,
        });
      }
    });

    // Foreign elite-brigade restriction
    if (bi.isForeign && def.corps === 'elite' && army.corps !== 'elite') {
      issues.push({ level: 'error', message: `${def.name} (${getNation(bi.nationId)?.name}) is an elite-corps brigade — only allowed if your own army is an Elite Corps.` });
    }
    // Foreign assets are never allowed (enforced in UI, double-checked here)
    if (bi.isForeign && bi.attachedAssets.length > 0) {
      issues.push({ level: 'error', message: `${def.name} (${getNation(bi.nationId)?.name}): foreign contingents may never carry your army assets.` });
    }

    // Per-brigade attach cap
    if (!bi.isForeign) {
      const group = nation.assetGroups.find((g) => !g.corps || g.corps === def.corps || def.corps === 'either') ?? nation.assetGroups[0];
      const cap = group?.maxAttachPerBrigade ?? 0;
      const used = brigadeAssetUsage(bi);
      if (used > cap) {
        issues.push({ level: 'error', message: `${def.name}: has ${used} attached army assets, max ${cap} per brigade.` });
      }
    }
  }

  // Army maximums
  for (const key of Object.keys(armyMaxCounts)) {
    const [nId, bId] = key.split(':');
    const def = getBrigadeDef(nId, bId);
    if (def?.armyMax !== undefined && armyMaxCounts[key] > def.armyMax) {
      issues.push({ level: 'error', message: `${def.name} (${getNation(nId)?.name}): army maximum is ${def.armyMax}, you have ${armyMaxCounts[key]}.` });
    }
  }

  // Essential brigade requirement (home nation only)
  const corpsOk = (c: Corps) => !nation.hasEliteLineSplit || !army.corps || c === army.corps || c === 'either';
  const hasEssential = army.brigades.some((bi) => {
    if (bi.isForeign) return false;
    const def = getBrigadeDef(bi.nationId, bi.brigadeId);
    return def?.essential && corpsOk(def.corps);
  });
  if (!hasEssential) {
    issues.push({ level: 'error', message: `Your order of battle needs at least one essential ${nation.name} brigade${army.corps ? ` (${army.corps} corps)` : ''}.` });
  }

  // Combo brigades: min 2 units, and asset army-wide max
  for (const cb of army.comboBrigades) {
    const total = cb.units.reduce((a, u) => a + u.count, 0);
    if (total < 2) {
      issues.push({ level: 'error', message: `Combined asset brigade has only ${total} unit(s) — needs at least 2.` });
    }
  }

  // Army-wide asset max checks
  for (const group of nation.assetGroups) {
    for (const asset of group.assets) {
      const used = assetUsageTotal(army, asset.name);
      if (used > asset.max) {
        issues.push({ level: 'error', message: `${asset.name}: purchased ${used}, army maximum is ${asset.max}.` });
      }
    }
  }

  // Earthworks
  if (nation.earthworks && army.earthworksSections > nation.earthworks.maxSections) {
    issues.push({ level: 'error', message: `Earthworks: maximum ${nation.earthworks.maxSections} sections, you have ${army.earthworksSections}.` });
  }

  // Point budget
  const total = totalArmyCost(army);
  if (total > army.pointLimit) {
    issues.push({ level: 'warning', message: `Over budget: ${total} / ${army.pointLimit} points.` });
  }

  return issues;
}

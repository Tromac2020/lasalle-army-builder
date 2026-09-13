import type { ArmyState } from '../logic/engine';
import { getNation, findUnit, findAssetDef, unitCost, assetCost } from '../logic/engine';
import { getCardProfile } from '../data/cardProfiles';
import type { UnitKind } from '../data/types';
import UnitCard from './UnitCard';

interface Instance {
  nationId: string;
  name: string;
  kind: UnitKind;
  cost: number;
  count: number;
}

function collectInstances(army: ArmyState): Instance[] {
  const map = new Map<string, Instance>();
  function add(nationId: string, name: string, kind: UnitKind, cost: number, n: number) {
    const key = `${nationId}:::${name}`;
    const cur = map.get(key);
    if (cur) cur.count += n;
    else map.set(key, { nationId, name, kind, cost, count: n });
  }

  for (const bi of army.brigades) {
    const nation = getNation(bi.nationId);
    if (!nation) continue;
    bi.lineSelections.forEach((sel) => {
      Object.entries(sel).forEach(([name, count]) => {
        if (count <= 0) return;
        const u = findUnit(nation, name);
        if (!u) return;
        add(bi.nationId, name, u.kind, unitCost(bi.nationId, name, army), count);
      });
    });
    bi.attachedAssets.forEach((a) => {
      const ad = findAssetDef(nation, a.name);
      if (!ad || ad.kind === 'special') return;
      add(bi.nationId, a.name, ad.kind, assetCost(bi.nationId, a.name, ad.cost, army), a.count);
    });
  }

  for (const cb of army.comboBrigades) {
    const nation = getNation(cb.nationId);
    if (!nation) continue;
    cb.units.forEach((u) => {
      const ad = findAssetDef(nation, u.name);
      if (!ad || ad.kind === 'special') return;
      add(cb.nationId, u.name, ad.kind, assetCost(cb.nationId, u.name, ad.cost, army), u.count);
    });
  }

  return Array.from(map.values()).sort((a, b) => {
    const order: Record<UnitKind, number> = { infantry: 0, cavalry: 1, artillery: 2 };
    if (a.kind !== b.kind) return order[a.kind] - order[b.kind];
    return a.name.localeCompare(b.name);
  });
}

export default function PrintCards({ army }: { army: ArmyState }) {
  const instances = collectInstances(army);
  const cards: { key: string; instance: Instance }[] = [];
  instances.forEach((inst) => {
    for (let i = 0; i < inst.count; i++) {
      cards.push({ key: `${inst.nationId}:${inst.name}:${i}`, instance: inst });
    }
  });

  const nation = army.nationId ? getNation(army.nationId) : undefined;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-1">{nation?.name ?? 'Army'} — Unit Cards</h1>
      <p className="text-xs text-stone-500 mb-4">
        One card per unit in the order of battle. Cut apart and use as tabletop tracking sheets. Icon artwork is the
        official game's own artwork, used with the rights holder's permission.
      </p>
      {cards.length === 0 && <p className="text-sm text-stone-500 italic">No units purchased yet.</p>}
      <div className="flex flex-wrap gap-3">
        {cards.map(({ key, instance }) => (
          <UnitCard
            key={key}
            name={instance.name}
            cost={instance.cost}
            profile={getCardProfile(instance.nationId, instance.name)}
            subtitle={instance.nationId !== army.nationId ? getNation(instance.nationId)?.name : undefined}
            nationId={instance.nationId}
          />
        ))}
      </div>
    </div>
  );
}

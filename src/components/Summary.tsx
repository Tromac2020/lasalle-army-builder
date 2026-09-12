import { nations } from '../data/nations';
import type { ArmyState } from '../logic/engine';
import { getNation, getBrigadeDef, brigadeTotalCost, comboBrigadeCost, earthworksCost, totalArmyCost, validateArmy, lineTotal } from '../logic/engine';

export default function Summary({ army }: { army: ArmyState }) {
  if (!army.nationId) return null;
  const nation = getNation(army.nationId)!;
  const issues = validateArmy(army);
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');
  const total = totalArmyCost(army);

  return (
    <div className="bg-white rounded-lg border border-stone-300 shadow-sm p-4 sticky top-4">
      <h2 className="font-bold text-lg mb-1">{nation.name}{army.corps ? ` — ${army.corps === 'elite' ? 'Elite' : 'Line'} Corps` : ''}</h2>
      <div className={`text-2xl font-bold mb-2 ${total > army.pointLimit ? 'text-red-600' : 'text-green-700'}`}>
        {total} / {army.pointLimit} pts
      </div>

      {errors.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-semibold text-red-700 mb-1">Fix before this is legal:</div>
          <ul className="text-xs text-red-700 list-disc list-inside space-y-0.5">
            {errors.map((e, i) => <li key={i}>{e.message}</li>)}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="mb-3">
          <ul className="text-xs text-amber-700 list-disc list-inside space-y-0.5">
            {warnings.map((w, i) => <li key={i}>{w.message}</li>)}
          </ul>
        </div>
      )}
      {errors.length === 0 && (
        <div className="text-sm text-green-700 mb-3">✓ Legal order of battle{total > army.pointLimit ? '' : '.'}</div>
      )}

      <button
        className="no-print w-full bg-stone-800 text-white rounded py-1.5 text-sm font-semibold hover:bg-stone-700 mb-4"
        onClick={() => window.print()}
      >
        Print / Save as PDF
      </button>

      <div id="printable-summary" className="text-sm space-y-3">
        {army.brigades.map((bi) => {
          const def = getBrigadeDef(bi.nationId, bi.brigadeId);
          if (!def) return null;
          const cost = brigadeTotalCost(bi, army);
          const parts: string[] = [];
          bi.lineSelections.forEach((sel) => {
            Object.entries(sel).forEach(([name, count]) => {
              if (count > 0) parts.push(`${count} ${name}`);
            });
          });
          bi.attachedAssets.forEach((a) => parts.push(`+${a.count} ${a.name} (asset)`));
          return (
            <div key={bi.id} className="border-b border-stone-200 pb-2">
              <div className="font-semibold flex justify-between">
                <span>{def.name}{bi.isForeign ? ` (${getNation(bi.nationId)?.name})` : ''}</span>
                <span>{cost} pts</span>
              </div>
              <div className="text-stone-600 text-xs">{parts.join(', ') || '—'}</div>
            </div>
          );
        })}

        {army.comboBrigades.map((cb, idx) => {
          const cost = comboBrigadeCost(cb, army, nation);
          const total = cb.units.reduce((a, u) => a + u.count, 0);
          return (
            <div key={cb.id} className="border-b border-stone-200 pb-2">
              <div className="font-semibold flex justify-between">
                <span>Combined Asset Brigade #{idx + 1} ({total} units)</span>
                <span>{cost} pts</span>
              </div>
              <div className="text-stone-600 text-xs">{cb.units.filter((u) => u.count > 0).map((u) => `${u.count} ${u.name}`).join(', ') || '—'}</div>
            </div>
          );
        })}

        {army.earthworksSections > 0 && nation.earthworks && (
          <div className="border-b border-stone-200 pb-2 flex justify-between">
            <span>Earthworks ({army.earthworksSections} × 4BW sections)</span>
            <span>{earthworksCost(army)} pts</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function lineTotalHelper(sel: Record<string, number>) {
  return lineTotal(sel);
}

export function allNationNames() {
  return nations.map((n) => n.name);
}

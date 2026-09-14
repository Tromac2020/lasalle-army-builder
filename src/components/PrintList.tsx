import type { ArmyState } from '../logic/engine';
import {
  getNation,
  getBrigadeDef,
  brigadeTotalCost,
  comboBrigadeCost,
  earthworksCost,
  totalArmyCost,
  validateArmy,
} from '../logic/engine';

export default function PrintList({ army }: { army: ArmyState }) {
  if (!army.nationId) return null;
  const nation = getNation(army.nationId);
  if (!nation) return null;
  const issues = validateArmy(army);
  const errors = issues.filter((i) => i.level === 'error');
  const total = totalArmyCost(army);
  const homeBrigades = army.brigades.filter((b) => !b.isForeign);
  const foreignBrigades = army.brigades.filter((b) => b.isForeign);

  function brigadeRows(bi: (typeof army.brigades)[number]) {
    const def = getBrigadeDef(bi.nationId, bi.brigadeId);
    if (!def) return null;
    const cost = brigadeTotalCost(bi, army);
    const parts: string[] = [];
    bi.lineSelections.forEach((sel) => {
      Object.entries(sel).forEach(([name, count]) => {
        if (count > 0) parts.push(`${count} × ${name}`);
      });
    });
    bi.attachedAssets.forEach((a) => parts.push(`+${a.count} × ${a.name} (army asset)`));
    return (
      <div key={bi.id} className="mb-2.5 break-inside-avoid">
        <div className="flex justify-between font-semibold text-sm">
          <span>
            {def.name}
            {bi.isForeign ? ` — ${getNation(bi.nationId)?.name}` : ''}
            {def.essential ? ' ★' : ''}
          </span>
          <span>{cost} pts</span>
        </div>
        <div className="text-xs text-stone-600 pl-3">{parts.join(', ') || '—'}</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto text-stone-900">
      <h1 className="text-2xl font-bold mb-0.5">
        {nation.name}
        {army.corps ? ` — ${army.corps === 'elite' ? 'Elite' : 'Line'} Corps` : ''}
      </h1>
      <div className="text-sm text-stone-600 mb-4">
        Order of Battle · {total} / {army.pointLimit} points
        {errors.length > 0 && <span className="text-red-700 font-semibold"> · {errors.length} rule issue(s) — see below</span>}
      </div>

      {homeBrigades.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500 border-b border-stone-300 mb-2 pb-0.5">
            {nation.name} Brigades
          </h2>
          {homeBrigades.map(brigadeRows)}
        </section>
      )}

      {army.comboBrigades.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500 border-b border-stone-300 mb-2 pb-0.5">
            Combined Asset Brigades
          </h2>
          {army.comboBrigades.map((cb, idx) => {
            const cost = comboBrigadeCost(cb, army, nation);
            const totalUnits = cb.units.reduce((a, u) => a + u.count, 0);
            return (
              <div key={cb.id} className="mb-2.5 break-inside-avoid">
                <div className="flex justify-between font-semibold text-sm">
                  <span>Combined Asset Brigade #{idx + 1} ({totalUnits} units)</span>
                  <span>{cost} pts</span>
                </div>
                <div className="text-xs text-stone-600 pl-3">
                  {cb.units.filter((u) => u.count > 0).map((u) => `${u.count} × ${u.name}`).join(', ') || '—'}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {foreignBrigades.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500 border-b border-stone-300 mb-2 pb-0.5">
            Foreign Contingents
          </h2>
          {foreignBrigades.map(brigadeRows)}
        </section>
      )}

      {army.earthworksSections > 0 && nation.earthworks && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500 border-b border-stone-300 mb-2 pb-0.5">
            Fortifications
          </h2>
          <div className="flex justify-between text-sm">
            <span>Earthworks ({army.earthworksSections} × 4BW sections)</span>
            <span>{earthworksCost(army)} pts</span>
          </div>
        </section>
      )}

      <div className="flex justify-between border-t-2 border-stone-800 pt-2 mt-4 font-bold text-lg">
        <span>Total</span>
        <span>{total} / {army.pointLimit} pts</span>
      </div>

      {errors.length > 0 && (
        <section className="mt-5 border border-red-300 bg-red-50 rounded p-3">
          <div className="text-sm font-semibold text-red-700 mb-1">Not yet a legal order of battle:</div>
          <ul className="text-xs text-red-700 list-disc list-inside space-y-0.5">
            {errors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="text-[10px] text-stone-400 mt-8">
        Generated with the Lasalle Army Maker v{__APP_VERSION__}. Lasalle and Lasalle Second Edition are copyright Sam Mustafa Publishing LLC.
      </div>
    </div>
  );
}

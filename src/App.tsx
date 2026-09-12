import { useMemo, useState } from 'react';
import { nations, getNation } from './data/nations';
import type { Corps } from './data/types';
import {
  newArmy,
  uid,
  type ArmyState,
  type BrigadeInstance,
  type ComboBrigade,
  getBrigadeDef,
  assetUsageTotal,
} from './logic/engine';
import BrigadeCard from './components/BrigadeCard';
import Summary from './components/Summary';
import Stepper from './components/Stepper';

function emptyLineSelections(nationId: string, brigadeId: string): Record<string, number>[] {
  const def = getBrigadeDef(nationId, brigadeId);
  return def ? def.lines.map(() => ({})) : [];
}

export default function App() {
  const [army, setArmy] = useState<ArmyState>(newArmy());
  const [foreignPick, setForeignPick] = useState<string>('');

  const nation = army.nationId ? getNation(army.nationId) : undefined;

  const homeBrigadeOptions = useMemo(() => {
    if (!nation) return [];
    return nation.brigades.filter((b) => b.corps === 'either' || !army.corps || b.corps === army.corps);
  }, [nation, army.corps]);

  const foreignNation = foreignPick ? getNation(foreignPick) : undefined;
  const foreignBrigadeOptions = useMemo(() => {
    if (!foreignNation) return [];
    return foreignNation.brigades.filter((b) => b.corps !== 'elite' || army.corps === 'elite');
  }, [foreignNation, army.corps]);

  function selectNation(id: string) {
    const n = getNation(id);
    setArmy((prev) => ({
      ...newArmy(),
      pointLimit: prev.pointLimit,
      nationId: id,
      corps: n?.hasEliteLineSplit ? 'line' : null,
    }));
  }

  function setCorps(c: Corps) {
    setArmy((prev) => ({ ...prev, corps: c, brigades: [] }));
  }

  function addBrigade(nationId: string, brigadeId: string, isForeign: boolean) {
    const bi: BrigadeInstance = {
      id: uid(),
      nationId,
      brigadeId,
      isForeign,
      lineSelections: emptyLineSelections(nationId, brigadeId),
      attachedAssets: [],
    };
    setArmy((prev) => ({ ...prev, brigades: [...prev.brigades, bi] }));
  }

  function updateBrigade(updated: BrigadeInstance) {
    setArmy((prev) => ({ ...prev, brigades: prev.brigades.map((b) => (b.id === updated.id ? updated : b)) }));
  }

  function removeBrigade(id: string) {
    setArmy((prev) => ({ ...prev, brigades: prev.brigades.filter((b) => b.id !== id) }));
  }

  function addCombo() {
    const cb: ComboBrigade = { id: uid(), nationId: army.nationId!, units: [] };
    setArmy((prev) => ({ ...prev, comboBrigades: [...prev.comboBrigades, cb] }));
  }

  function updateCombo(updated: ComboBrigade) {
    setArmy((prev) => ({ ...prev, comboBrigades: prev.comboBrigades.map((c) => (c.id === updated.id ? updated : c)) }));
  }

  function removeCombo(id: string) {
    setArmy((prev) => ({ ...prev, comboBrigades: prev.comboBrigades.filter((c) => c.id !== id) }));
  }

  const homeBrigades = army.brigades.filter((b) => !b.isForeign);
  const foreignBrigadesInArmy = army.brigades.filter((b) => b.isForeign);

  return (
    <div className="min-h-screen">
      <header className="bg-stone-800 text-stone-100 py-4 px-4 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold tracking-wide">⚔ Lasalle Army Maker</h1>
            <p className="text-stone-400 text-xs">Unofficial army builder for Lasalle 2nd Edition, based on Sam A. Mustafa's Army Maker booklet</p>
          </div>
          {army.nationId && (
            <button className="text-xs underline text-stone-300 hover:text-white" onClick={() => setArmy(newArmy())}>
              Start over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* --- Nation setup --- */}
          <section className="bg-white rounded-lg border border-stone-300 p-4 no-print">
            <h2 className="font-bold mb-3">1. Choose your army</h2>
            <div className="flex flex-wrap gap-4 items-end">
              <label className="flex flex-col text-sm">
                <span className="font-medium mb-1">Nationality</span>
                <select
                  className="border border-stone-400 rounded px-2 py-1.5 min-w-[240px]"
                  value={army.nationId ?? ''}
                  onChange={(e) => selectNation(e.target.value)}
                >
                  <option value="" disabled>Select a nation…</option>
                  <optgroup label="Major Powers">
                    {nations.filter((n) => n.powerType === 'major').map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Minor Powers">
                    {nations.filter((n) => n.powerType === 'minor').map((n) => (
                      <option key={n.id} value={n.id} disabled={n.noIndependentArmy}>
                        {n.name}{n.noIndependentArmy ? ' (no independent army)' : ''}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>

              {nation?.hasEliteLineSplit && (
                <label className="flex flex-col text-sm">
                  <span className="font-medium mb-1">Corps type</span>
                  <div className="flex border border-stone-400 rounded overflow-hidden">
                    <button
                      className={`px-3 py-1.5 ${army.corps === 'line' ? 'bg-stone-800 text-white' : 'bg-white'}`}
                      onClick={() => setCorps('line')}
                    >
                      Line Corps
                    </button>
                    <button
                      className={`px-3 py-1.5 ${army.corps === 'elite' ? 'bg-stone-800 text-white' : 'bg-white'}`}
                      onClick={() => setCorps('elite')}
                    >
                      Elite Corps
                    </button>
                  </div>
                </label>
              )}

              <label className="flex flex-col text-sm">
                <span className="font-medium mb-1">Point limit</span>
                <input
                  type="number"
                  className="border border-stone-400 rounded px-2 py-1.5 w-28"
                  value={army.pointLimit}
                  onChange={(e) => setArmy((prev) => ({ ...prev, pointLimit: Number(e.target.value) || 0 }))}
                />
              </label>
            </div>

            {nation && (
              <div className="mt-3 text-xs text-stone-500 bg-stone-50 rounded p-2 space-y-0.5">
                {nation.historicalParameters.atWar && <div><b>At War:</b> {nation.historicalParameters.atWar}</div>}
                {nation.historicalParameters.allies && <div><b>Allies:</b> {nation.historicalParameters.allies}</div>}
                {nation.historicalParameters.enemies && <div><b>Enemies:</b> {nation.historicalParameters.enemies}</div>}
                {nation.historicalParameters.clients && <div><b>Clients:</b> {nation.historicalParameters.clients}</div>}
                {nation.historicalParameters.clientOf && <div><b>Client of:</b> {nation.historicalParameters.clientOf}</div>}
                {nation.historicalParameters.eliteCorps && <div><b>Elite Corps:</b> {nation.historicalParameters.eliteCorps}</div>}
                {nation.historicalParameters.notes && <div className="italic">{nation.historicalParameters.notes}</div>}
              </div>
            )}
          </section>

          {nation && (
            <>
              {/* --- Home brigades --- */}
              <section className="bg-white rounded-lg border border-stone-300 p-4">
                <div className="flex items-center justify-between mb-3 no-print">
                  <h2 className="font-bold">2. {nation.name} brigades</h2>
                  <select
                    className="border border-stone-400 rounded px-2 py-1.5 text-sm"
                    value=""
                    onChange={(e) => e.target.value && addBrigade(nation.id, e.target.value, false)}
                  >
                    <option value="">+ Add brigade…</option>
                    {homeBrigadeOptions.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}{b.dates ? ` (${b.dates})` : ''}{b.essential ? ' ★' : ''}{b.armyMax !== undefined ? ` [max ${b.armyMax}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {homeBrigades.length === 0 && <p className="text-sm text-stone-400 italic">No brigades yet — add one above.</p>}
                {homeBrigades.map((bi) => (
                  <BrigadeCard key={bi.id} bi={bi} army={army} onChange={updateBrigade} onRemove={() => removeBrigade(bi.id)} />
                ))}
              </section>

              {/* --- Combined asset brigades --- */}
              {nation.assetGroups.some((g) => g.assets.length > 0) && (
                <section className="bg-white rounded-lg border border-stone-300 p-4">
                  <div className="flex items-center justify-between mb-2 no-print">
                    <h2 className="font-bold">3. Combine assets into their own brigade (optional)</h2>
                    <button className="text-sm bg-stone-800 text-white rounded px-3 py-1" onClick={addCombo}>+ New combo brigade</button>
                  </div>
                  <p className="text-xs text-stone-500 mb-2 no-print">Army asset units may instead be combined into brand-new brigades of their own, as long as each has at least two units. No further assets may attach to a combo brigade.</p>
                  {army.comboBrigades.map((cb) => (
                    <ComboCard key={cb.id} cb={cb} army={army} onChange={updateCombo} onRemove={() => removeCombo(cb.id)} />
                  ))}
                </section>
              )}

              {/* --- Earthworks --- */}
              {nation.earthworks && (
                <section className="bg-white rounded-lg border border-stone-300 p-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">Earthworks</h2>
                    <p className="text-xs text-stone-500">Up to {nation.earthworks.maxSections} sections of 4BW, {nation.earthworks.costPerSection}pts each. Set up within 1BW of a friendly infantry or artillery unit; not attached to any brigade.</p>
                  </div>
                  <Stepper
                    value={army.earthworksSections}
                    min={0}
                    max={nation.earthworks.maxSections}
                    onChange={(v) => setArmy((prev) => ({ ...prev, earthworksSections: v }))}
                  />
                </section>
              )}

              {/* --- Foreign contingents --- */}
              <section className="bg-white rounded-lg border border-stone-300 p-4 no-print">
                <h2 className="font-bold mb-2">4. Foreign contingents (optional)</h2>
                <p className="text-xs text-stone-500 mb-3">Add allied (major) or client (minor) brigades. Foreign brigades never carry your army's assets, and foreign elite-corps brigades require your own army to be an Elite Corps.</p>
                <div className="flex flex-wrap gap-3 items-end mb-3">
                  <label className="flex flex-col text-sm">
                    <span className="font-medium mb-1">Nation</span>
                    <select
                      className="border border-stone-400 rounded px-2 py-1.5"
                      value={foreignPick}
                      onChange={(e) => setForeignPick(e.target.value)}
                    >
                      <option value="">Select a nation…</option>
                      {nations.filter((n) => n.id !== nation.id).map((n) => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </select>
                  </label>
                  {foreignNation && (
                    <label className="flex flex-col text-sm">
                      <span className="font-medium mb-1">Brigade</span>
                      <select
                        className="border border-stone-400 rounded px-2 py-1.5"
                        value=""
                        onChange={(e) => e.target.value && addBrigade(foreignNation.id, e.target.value, true)}
                      >
                        <option value="">+ Add brigade…</option>
                        {foreignBrigadeOptions.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}{b.dates ? ` (${b.dates})` : ''}{b.corps === 'elite' ? ' [elite]' : ''}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                {foreignBrigadesInArmy.map((bi) => (
                  <BrigadeCard key={bi.id} bi={bi} army={army} onChange={updateBrigade} onRemove={() => removeBrigade(bi.id)} />
                ))}
              </section>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          {nation ? <Summary army={army} /> : (
            <div className="bg-white rounded-lg border border-stone-300 p-4 text-sm text-stone-500">
              Pick a nation to start building your order of battle.
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 pb-8 text-xs text-stone-400 no-print">
        Data transcribed from <i>The Army Maker</i> v1.22 for Lasalle Second Edition by Sam A. Mustafa (Honour Games).
        This is an unofficial fan-made tool; Lasalle and Lasalle Second Edition are copyright Sam Mustafa Publishing LLC.
        Sapeur / ADC / Partisan costs are not printed in the Army Maker booklet — set your own house-rule value where they appear.
      </footer>
    </div>
  );
}

function ComboCard({ cb, army, onChange, onRemove }: { cb: ComboBrigade; army: ArmyState; onChange: (c: ComboBrigade) => void; onRemove: () => void }) {
  const nation = getNation(cb.nationId);
  if (!nation) return null;
  const total = cb.units.reduce((a, u) => a + u.count, 0);

  function setCount(name: string, count: number) {
    let units = cb.units.filter((u) => u.name !== name);
    if (count > 0) units = [...units, { name, count }];
    onChange({ ...cb, units });
  }

  return (
    <div className={`rounded-lg border-2 border-blue-300 bg-blue-50 p-3 mb-3 ${total < 2 ? 'ring-2 ring-red-300' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-semibold ${total < 2 ? 'text-red-600' : 'text-stone-700'}`}>{total} unit(s) — needs 2+</span>
        <button onClick={onRemove} className="text-xs text-red-600 hover:underline no-print">Remove</button>
      </div>
      <div className="flex flex-wrap gap-3 no-print">
        {nation.assetGroups.flatMap((g) => g.assets).filter((a) => a.kind !== 'special' || true).map((asset) => {
          const current = cb.units.find((u) => u.name === asset.name)?.count ?? 0;
          const armyUsed = assetUsageTotal(army, asset.name);
          const cap = Math.max(0, asset.max - armyUsed + current);
          return (
            <div key={asset.name} className="flex items-center gap-1.5 text-sm bg-white border border-blue-200 rounded px-2 py-1">
              <span>{asset.name}</span>
              <span className="text-xs text-stone-400">{asset.cost === null ? '(set cost above)' : `(${asset.cost}pt)`}</span>
              <Stepper value={current} min={0} max={cap} onChange={(v) => setCount(asset.name, v)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

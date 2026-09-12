import type { Nation, AssetGroup } from '../data/types';
import type { ArmyState, BrigadeInstance } from '../logic/engine';
import { getBrigadeDef, getNation, unitCost, lineTotal, brigadeAssetUsage, assetUsageTotal, brigadeTotalCost } from '../logic/engine';
import Stepper from './Stepper';

function applicableAssetGroup(nation: Nation, brigadeCorps: string, armyCorps: string | null): AssetGroup | undefined {
  if (nation.assetGroups.length === 0) return undefined;
  if (nation.assetGroups.length === 1) return nation.assetGroups[0];
  // Nation has per-corps asset groups (France): match brigade's corps, falling back to the army's declared corps.
  const wanted = brigadeCorps !== 'either' ? brigadeCorps : armyCorps;
  return nation.assetGroups.find((g) => g.corps === wanted) ?? nation.assetGroups[0];
}

interface Props {
  bi: BrigadeInstance;
  army: ArmyState;
  onChange: (bi: BrigadeInstance) => void;
  onRemove: () => void;
}

export default function BrigadeCard({ bi, army, onChange, onRemove }: Props) {
  const nation = getNation(bi.nationId);
  const def = getBrigadeDef(bi.nationId, bi.brigadeId);
  if (!nation || !def) return null;

  const totalUnits = bi.lineSelections.reduce((a, s) => a + lineTotal(s), 0);
  const cost = brigadeTotalCost(bi, army);
  const assetGroup = !bi.isForeign ? applicableAssetGroup(nation, def.corps, army.corps) : undefined;
  const brigadeAssetsUsed = brigadeAssetUsage(bi);

  function setLineOption(lineIdx: number, option: string, count: number) {
    const lineSelections = bi.lineSelections.map((s, i) => (i === lineIdx ? { ...s, [option]: count } : s));
    onChange({ ...bi, lineSelections });
  }

  function setAssetCount(name: string, count: number) {
    let attachedAssets = bi.attachedAssets.filter((a) => a.name !== name);
    if (count > 0) attachedAssets = [...attachedAssets, { name, count }];
    onChange({ ...bi, attachedAssets });
  }

  return (
    <div className={`rounded-lg border-2 p-4 mb-4 shadow-sm ${bi.isForeign ? 'bg-amber-50 border-amber-300' : def.category === 'reserve' ? 'bg-yellow-50 border-yellow-600/40' : 'bg-rose-50 border-rose-300'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-stone-800">{def.name}</h3>
            {def.dates && <span className="text-xs text-stone-500 italic">({def.dates})</span>}
            {def.essential && <span title="Essential brigade" className="text-amber-500 text-lg leading-none">★</span>}
            {def.armyMax !== undefined && <span className="text-xs bg-stone-700 text-white rounded px-1.5 py-0.5">max {def.armyMax}</span>}
            {bi.isForeign && <span className="text-xs bg-amber-600 text-white rounded px-1.5 py-0.5">Foreign: {nation.name}</span>}
            {nation.hasEliteLineSplit && def.corps !== 'either' && (
              <span className="text-xs bg-stone-500 text-white rounded px-1.5 py-0.5 capitalize">{def.corps} corps</span>
            )}
          </div>
          <p className={`text-sm mt-0.5 ${totalUnits < 2 ? 'text-red-600 font-semibold' : 'text-stone-500'}`}>{totalUnits} unit(s) selected (brigade needs 2+)</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-stone-800">{cost} pts</div>
          <button onClick={onRemove} className="text-xs text-red-600 hover:underline mt-1">
            Remove
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {def.lines.map((line, li) => {
          const sel = bi.lineSelections[li] ?? {};
          const t = lineTotal(sel);
          const ok = t >= line.min && t <= line.max;
          return (
            <div key={li} className="bg-white/60 rounded p-2">
              <div className={`text-xs font-semibold mb-1 ${ok ? 'text-stone-600' : 'text-red-600'}`}>
                {line.min}-{line.max}: {line.options.join(' or ')}
                {line.note && <span className="italic font-normal"> ({line.note})</span>}
                <span className="ml-2">[{t}/{line.max}]</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {line.options.map((opt) => {
                  const count = sel[opt] ?? 0;
                  const others = t - count;
                  const cap = Math.max(0, line.max - others);
                  const uc = unitCost(bi.nationId, opt, army);
                  return (
                    <div key={opt} className="flex items-center gap-2 text-sm">
                      <span className="text-stone-700">{opt} <span className="text-stone-400">({uc}pt)</span></span>
                      <Stepper value={count} min={0} max={cap} onChange={(v) => setLineOption(li, opt, v)} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!bi.isForeign && assetGroup && assetGroup.assets.length > 0 && (
        <div className="mt-3 border-t border-dashed border-stone-400 pt-2">
          <div className="text-xs font-semibold text-stone-600 mb-1">
            Attach army assets ({brigadeAssetsUsed}/{assetGroup.maxAttachPerBrigade} attached to this brigade)
          </div>
          <div className="flex flex-wrap gap-3">
            {assetGroup.assets.map((asset) => {
              const current = bi.attachedAssets.find((a) => a.name === asset.name)?.count ?? 0;
              const armyUsed = assetUsageTotal(army, asset.name);
              const armyRemaining = asset.max - armyUsed + current;
              const brigadeRemaining = assetGroup.maxAttachPerBrigade - brigadeAssetsUsed + current;
              const restricted = asset.restriction && !def.name.toLowerCase().includes('cav');
              const cap = Math.max(0, Math.min(armyRemaining, brigadeRemaining, restricted ? 0 : Infinity));
              const overrideKey = `${bi.nationId}:${asset.name}`;
              return (
                <div key={asset.name} className="flex items-center gap-1.5 text-sm bg-blue-50 border border-blue-200 rounded px-2 py-1">
                  <span className={asset.advanced ? 'italic text-stone-700' : 'text-stone-700'}>{asset.name}</span>
                  {asset.cost === null ? (
                    <span className="flex items-center gap-1 text-xs text-stone-500">
                      cost:
                      <input
                        type="number"
                        className="w-12 border border-stone-300 rounded px-1"
                        value={army.assetCostOverrides[overrideKey] ?? 0}
                        onChange={(e) => {
                          army.assetCostOverrides[overrideKey] = Number(e.target.value) || 0;
                          onChange({ ...bi });
                        }}
                      />
                    </span>
                  ) : (
                    <span className="text-stone-400 text-xs">({asset.cost}pt)</span>
                  )}
                  {asset.restriction && <span className="text-xs text-amber-700 italic">{asset.restriction}</span>}
                  <Stepper value={current} min={0} max={cap} onChange={(v) => setAssetCount(asset.name, v)} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

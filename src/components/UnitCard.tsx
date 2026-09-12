import type { CardProfile } from '../data/cardProfiles';
import { KindIcon, ResolveBurst, SkirmishBadge, TraitIcon, traitLabel } from './icons';

interface Props {
  name: string;
  cost: number;
  profile?: CardProfile;
  subtitle?: string;
}

export default function UnitCard({ name, cost, profile, subtitle }: Props) {
  return (
    <div
      className="border-2 border-stone-700 rounded bg-white p-2 flex flex-col gap-1.5"
      style={{ breakInside: 'avoid', pageBreakInside: 'avoid', width: '3.2in' }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-stone-300 pb-1">
        <div className="min-w-0">
          <div className="font-bold text-sm leading-tight truncate">{name}</div>
          {subtitle && <div className="text-[10px] text-stone-500 italic leading-tight">{subtitle}</div>}
        </div>
        <div className="shrink-0 w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs border border-amber-800">
          {cost}
        </div>
      </div>

      {!profile ? (
        <div className="text-[11px] text-stone-400 italic py-2 text-center">
          No card stats available for this item (not in the printed Army Tablet).
        </div>
      ) : profile.kind === 'artillery' ? (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-0.5">
              {profile.track.map((v, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold border border-stone-600 ${
                    i >= profile.track.length - profile.shaken ? 'bg-amber-300' : 'bg-white'
                  }`}
                >
                  {v}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-stone-500">fire dice</span>
            <div className="flex items-center gap-0.5 ml-auto">
              <KindIcon kind="artillery" size={18} />
              <span className="text-[11px] font-bold">{profile.toHit}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {profile.traits.map((t) => (
                <span key={t} title={traitLabel(t)}>
                  <TraitIcon trait={t} size={16} />
                </span>
              ))}
            </div>
            <ResolveBurst value={profile.resolve} size={26} />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1.5 flex-wrap">
            {profile.kind === 'cavalry' ? <KindIcon kind="cavalry" size={20} /> : <SkirmishBadge value={profile.skirmish ?? 0} size={20} />}
            {profile.traits.map((t) => (
              <span key={t} title={traitLabel(t)}>
                <TraitIcon trait={t} size={16} />
              </span>
            ))}
            <div className="ml-auto">
              <ResolveBurst value={profile.resolve} size={26} />
            </div>
          </div>
          <div className="flex gap-0.5">
            {profile.track.map((v, i) => (
              <div
                key={i}
                className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold border border-stone-600 ${
                  i >= profile.track.length - profile.shaken ? 'bg-amber-300' : 'bg-white'
                }`}
              >
                {v}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

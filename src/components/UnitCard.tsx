import type { CardProfile } from '../data/cardProfiles';
import { getNationColor, nationHeaderGradient } from '../data/nationColors';
import { CostBadge, DicePair, KindIcon, ResolveBurst, SkirmishBadge, ToHitBadge, TraitIcon, traitLabel } from './icons';

interface Props {
  name: string;
  cost: number;
  profile?: CardProfile;
  subtitle?: string;
  /** Which nation's Army Tablet this unit belongs to — picks the header color, matching the source booklet. */
  nationId?: string;
}

function TrackBoxes({ track, shaken }: { track: number[]; shaken: number }) {
  return (
    <div className="flex gap-0.5">
      {track.map((v, i) => (
        <div
          key={i}
          className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold border border-stone-800 font-sans ${
            i >= track.length - shaken ? 'bg-amber-300' : 'bg-white'
          }`}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

export default function UnitCard({ name, cost, profile, subtitle, nationId }: Props) {
  const nc = getNationColor(nationId);
  return (
    <div
      className="border-[1.5px] border-stone-900 rounded-sm bg-white flex flex-col font-sans overflow-hidden"
      style={{ breakInside: 'avoid', pageBreakInside: 'avoid', width: '3.6in' }}
    >
      <div
        className="flex items-center justify-between gap-2 px-2 py-1 border-b-[2.5px] border-stone-900"
        style={{ background: nationHeaderGradient(nationId) }}
      >
        <div className="min-w-0">
          <div className="font-bold text-sm leading-tight truncate" style={{ color: nc.text }}>
            {name}
          </div>
          {subtitle && (
            <div className="text-[10px] italic leading-tight" style={{ color: nc.subtitle }}>
              {subtitle}
            </div>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {profile?.kind === 'cavalry' && <KindIcon kind="cavalry" size={22} />}
          {profile?.kind === 'artillery' && <KindIcon kind="artillery" size={22} />}
          <CostBadge value={cost} size={28} />
        </div>
      </div>

      <div className="p-2 flex flex-col gap-1.5">
        {!profile ? (
          <div className="text-[11px] text-stone-400 italic py-2 text-center">
            No card stats available for this item (not in the printed Army Tablet).
          </div>
        ) : profile.kind === 'artillery' ? (
          <div className="flex items-center gap-2 flex-wrap">
            <TrackBoxes track={profile.track} shaken={profile.shaken} />
            <DicePair size={24} />
            {profile.toHit && <ToHitBadge value={profile.toHit} size={30} />}
            {profile.traits.map((t) => (
              <span key={t} title={traitLabel(t)}>
                <TraitIcon trait={t} size={28} />
              </span>
            ))}
            <div className="ml-auto">
              <ResolveBurst value={profile.resolve} size={46} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              {profile.kind !== 'cavalry' && <SkirmishBadge value={profile.skirmish ?? 0} size={24} />}
              {profile.traits.map((t) => (
                <span key={t} title={traitLabel(t)}>
                  <TraitIcon trait={t} size={28} />
                </span>
              ))}
              <div className="ml-auto">
                <ResolveBurst value={profile.resolve} size={46} />
              </div>
            </div>
            <TrackBoxes track={profile.track} shaken={profile.shaken} />
          </>
        )}
      </div>
    </div>
  );
}

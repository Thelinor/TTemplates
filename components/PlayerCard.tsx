"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRaid } from '@/app/RaidContext';
import { ROLE_ICON_MAP } from '@/lib/iconMaps';

interface PlayerCardProps {
  playerId: number;
}

export default function PlayerCard({ playerId }: PlayerCardProps) {
  const { players } = useRaid();
  const player = players.find((p) => p.id === playerId);

  if (!player) return null;

  const classList = [
    player.skillClasses.MainSkillClass,
    player.skillClasses.SecondSkillClass,
    player.skillClasses.ThirdSkillClass,
  ].filter(Boolean);

  return (
    <Link href={`/overview/${player.id}`}>
      <div className="bg-linear-to-b from-amber-900 via-yellow-900 to-amber-950 border-2 border-yellow-600 rounded-lg p-6 w-96 shadow-2xl text-yellow-100 cursor-pointer hover:border-yellow-400 hover:shadow-yellow-500/50 transition-all duration-200 transform hover:scale-105">
        <div className="flex items-center justify-between mb-4 border-b border-yellow-600 pb-3">
          <h2 className="text-2xl font-bold text-yellow-300">{player.name}</h2>
          <div className="flex items-center gap-2 bg-yellow-950 px-3 py-1 rounded">
            <Image src={ROLE_ICON_MAP[player.role] || ''} alt={player.role} width={32} height={32} className="w-8 h-8" />
            <span className="text-sm font-semibold text-yellow-300">{player.role}</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Classes</h3>
          <div className="flex flex-wrap gap-2">
            {classList.length > 0 ? (
              classList.map((cls) => (
                <div key={cls} className="bg-yellow-950 px-2 py-1 rounded border border-yellow-600 text-sm text-yellow-100">
                  {cls}
                </div>
              ))
            ) : (
              <span className="text-sm text-yellow-300">Aucune classe</span>
            )}
          </div>
        </div>

        <div className="space-y-2 text-xs text-yellow-200">
          <div className="bg-yellow-950 p-2 rounded border border-yellow-700">
            <span className="font-semibold text-yellow-300">Masteries: </span>
            <span>{[player.classMasteries.firstClassMastery, player.classMasteries.secondClassMastery].filter(Boolean).join(' / ') || '—'}</span>
          </div>
          <div className="bg-yellow-950 p-2 rounded border border-yellow-700">
            <span className="font-semibold text-yellow-300">Mundus: </span>
            <span>{player.mundus || '—'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

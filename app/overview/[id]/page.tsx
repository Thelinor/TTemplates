"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRaid } from '@/app/RaidContext';
import { ROLE_ICON_MAP } from '@/lib/iconMaps';

export default function PlayerOverview() {
  const params = useParams<{ id: string }>();
  const { players } = useRaid();
  const player = players.find((entry) => entry.id === Number(params.id));

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Joueur non trouvé</h1>
          <Link href="/" className="text-yellow-300 hover:text-yellow-400 underline">Retour à l&apos;accueil</Link>
        </div>
      </div>
    );
  }

  const classList = [
    player.skillClasses.MainSkillClass,
    player.skillClasses.SecondSkillClass,
    player.skillClasses.ThirdSkillClass,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-6 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition">
          ← Retour
        </Link>

        <div className="bg-gradient-to-b from-amber-900 via-yellow-900 to-amber-950 border-4 border-yellow-600 rounded-lg p-8 shadow-2xl text-yellow-100">
          <div className="flex items-center justify-between mb-6 border-b-2 border-yellow-600 pb-4">
            <h1 className="text-4xl font-bold text-yellow-300">{player.name}</h1>
            <div className="flex items-center gap-3 bg-yellow-950 px-4 py-2 rounded-lg border border-yellow-600">
              <Image src={ROLE_ICON_MAP[player.role] || ''} alt={player.role} width={48} height={48} className="w-12 h-12" />
              <span className="text-2xl font-semibold text-yellow-300">{player.role}</span>
            </div>
          </div>

          <div className="mb-8 bg-yellow-950 p-4 rounded-lg border border-yellow-700">
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-widest mb-4">Classes</h2>
            <div className="flex gap-4 flex-wrap">
              {classList.length > 0 ? classList.map((cls) => (
                <div key={cls} className="bg-yellow-900 px-3 py-2 rounded border border-yellow-600 text-yellow-100">
                  {cls}
                </div>
              )) : <span className="text-yellow-300">Aucune classe sélectionnée</span>}
            </div>
          </div>

          <div className="space-y-4 bg-yellow-950 p-4 rounded-lg border border-yellow-700">
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-widest">Informations</h2>
            <div className="grid md:grid-cols-2 gap-4 text-yellow-100">
              <div className="bg-yellow-900 p-3 rounded border border-yellow-700">
                <span className="text-yellow-300 font-semibold">Masteries: </span>
                {[player.classMasteries.firstClassMastery, player.classMasteries.secondClassMastery].filter(Boolean).join(' / ') || '—'}
              </div>
              <div className="bg-yellow-900 p-3 rounded border border-yellow-700">
                <span className="text-yellow-300 font-semibold">Mundus: </span>
                {player.mundus || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

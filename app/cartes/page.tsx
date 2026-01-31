'use client';

import Link from 'next/link';
import { useRaid } from '@/app/RaidContext';
import PlayerCard from '@/components/PlayerCard';
import raidData from '@/data/raidTemplate.json';

export default function CartesView() {
  const { players } = useRaid();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">
            {raidData.raidName}
          </h1>
          <Link 
            href="/" 
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition"
          >
            ← Retour
          </Link>
        </div>
        
        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-8"></div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              playerId={player.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

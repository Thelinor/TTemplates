"use client";

import { useRaid } from '@/app/RaidContext';
import PlayerCard from '@/components/PlayerCard';
import { getRaidDisplayName } from '@/lib/raidDisplay';

export default function RaidView() {
  const { players, template } = useRaid();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center drop-shadow-lg">
          {getRaidDisplayName(template.raid.selectedRaid, template.raid.groupName)}
        </h1>
        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {players.map((player) => (
            <PlayerCard key={player.id} playerId={player.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

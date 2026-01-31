import PlayerCard from '@/components/PlayerCard';
import raidData from '@/data/raidTemplate.json';

export default function RaidView() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-amber-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Raid Title */}
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 text-center drop-shadow-lg">
          {raidData.raidName}
        </h1>
        <div className="h-1 bg-linear-to-r from-transparent via-yellow-500 to-transparent mb-8"></div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {raidData.players.map((player) => (
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

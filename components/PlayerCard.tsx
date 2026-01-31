'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRaid } from '@/app/RaidContext';

interface PlayerCardProps {
  playerId: number;
}

// Icon mapping for abilities/classes
const iconMap: { [key: string]: string } = {
  // Classes
  'Assassination': '/spliticons/ability/nightblade/007.png',
  'Ardent Flame': '/spliticons/ability/nightblade/003_b.png',
  'Earthen Heart': '/spliticons/ability/nightblade/013_b.png',
  
  // Skills - Front Bar
  'Heroic Slash': '/spliticons/ability/1handed/001.png',
  'Pierce Armor': '/spliticons/ability/1handed/002_b.png',
  
  // Skills - Back Bar
  'Igneous Shield': '/spliticons/ability/dragonknight/013_a.png',
  'Chains': '/spliticons/ability/dragonknight/005_a.png',
};

const roleIconMap: { [key: string]: string } = {
  'Tank': '/spliticons/lfg/lfg_tank_down_no_glow_64.png',
  'Heal': '/spliticons/lfg/lfg_heal_down_no_glow_64.png',
  'DPS': '/spliticons/lfg/lfg_dps_down_no_glow_64.png',
};

export default function PlayerCard({ playerId }: PlayerCardProps) {
  const { players } = useRaid();
  const player = players.find(p => p.id === playerId);

  if (!player) return null;

  return (
    <Link href={`/overview/${player.id}`}>
      <div className="bg-linear-to-b from-amber-900 via-yellow-900 to-amber-950 border-2 border-yellow-600 rounded-lg p-6 w-96 shadow-2xl text-yellow-100 cursor-pointer hover:border-yellow-400 hover:shadow-yellow-500/50 transition-all duration-200 transform hover:scale-105">
        {/* Header with Name and Role */}
        <div className="flex items-center justify-between mb-4 border-b border-yellow-600 pb-3">
          <h2 className="text-2xl font-bold text-yellow-300">{player.name}</h2>
          <div className="flex items-center gap-2 bg-yellow-950 px-3 py-1 rounded">
            <Image
              src={roleIconMap[player.role] || ''}
              alt={player.role}
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-sm font-semibold text-yellow-300">{player.role}</span>
          </div>
        </div>

        {/* Classes Section */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Classes</h3>
          <div className="flex gap-2">
            {player.classes.map((cls) => (
              <div key={cls} className="relative group">
                <div className="bg-yellow-950 p-2 rounded border border-yellow-600 hover:border-yellow-400 transition">
                  <Image
                    src={iconMap[cls] || ''}
                    alt={cls}
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {cls}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Bars Section */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Skill Bars</h3>
          
          {/* Front Bar */}
          <div className="mb-3">
            <p className="text-xs text-yellow-300 mb-1">Front Bar</p>
            <div className="flex gap-1 bg-yellow-950 p-2 rounded border border-yellow-700">
              {player.bars.front.map((skill) => (
                <div key={skill} className="relative group">
                  <div className="bg-yellow-900 p-1 rounded border border-yellow-600 hover:border-yellow-400 transition">
                    <Image
                      src={iconMap[skill] || ''}
                      alt={skill}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {skill}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Bar */}
          <div>
            <p className="text-xs text-yellow-300 mb-1">Back Bar</p>
            <div className="flex gap-1 bg-yellow-950 p-2 rounded border border-yellow-700">
              {player.bars.back.map((skill) => (
                <div key={skill} className="relative group">
                  <div className="bg-yellow-900 p-1 rounded border border-yellow-600 hover:border-yellow-400 transition">
                    <Image
                      src={iconMap[skill] || ''}
                      alt={skill}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {skill}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Champion Points Section */}
        <div>
          <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">Champion Points</h3>
          <div className="space-y-1 text-xs">
            {player.championPoints.warior.length > 0 && (
              <div className="bg-yellow-950 p-2 rounded border border-yellow-700">
                <span className="text-yellow-300 font-semibold">Warrior: </span>
                <span className="text-yellow-100">{player.championPoints.warior.join(', ')}</span>
              </div>
            )}
            {player.championPoints.mage.length > 0 && (
              <div className="bg-yellow-950 p-2 rounded border border-yellow-700">
                <span className="text-yellow-300 font-semibold">Mage: </span>
                <span className="text-yellow-100">{player.championPoints.mage.join(', ')}</span>
              </div>
            )}
            {player.championPoints.steed.length > 0 && (
              <div className="bg-yellow-950 p-2 rounded border border-yellow-700">
                <span className="text-yellow-300 font-semibold">Steed: </span>
                <span className="text-yellow-100">{player.championPoints.steed.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

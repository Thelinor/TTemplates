import Link from 'next/link';
import Image from 'next/image';
import raidData from '@/data/raidTemplate.json';

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

export default function PlayerOverview({ params }: { params: { id: string } }) {
  const player = raidData.players.find(p => p.id === parseInt(params.id));

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Joueur non trouvé</h1>
          <Link href="/" className="text-yellow-300 hover:text-yellow-400 underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-block mb-6 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition">
          ← Retour
        </Link>

        {/* Main Card */}
        <div className="bg-gradient-to-b from-amber-900 via-yellow-900 to-amber-950 border-4 border-yellow-600 rounded-lg p-8 shadow-2xl text-yellow-100">
          
          {/* Header with Name and Role */}
          <div className="flex items-center justify-between mb-6 border-b-2 border-yellow-600 pb-4">
            <h1 className="text-4xl font-bold text-yellow-300">{player.name}</h1>
            <div className="flex items-center gap-3 bg-yellow-950 px-4 py-2 rounded-lg border border-yellow-600">
              <Image
                src={roleIconMap[player.role] || ''}
                alt={player.role}
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <span className="text-2xl font-semibold text-yellow-300">{player.role}</span>
            </div>
          </div>

          {/* Classes Section */}
          <div className="mb-8 bg-yellow-950 p-4 rounded-lg border border-yellow-700">
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-widest mb-4">Classes</h2>
            <div className="flex gap-4">
              {player.classes.map((cls) => (
                <div key={cls} className="relative group">
                  <div className="bg-yellow-900 p-3 rounded-lg border-2 border-yellow-600 hover:border-yellow-400 transition">
                    <Image
                      src={iconMap[cls] || ''}
                      alt={cls}
                      width={64}
                      height={64}
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {cls}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Bars Section */}
          <div className="mb-8 bg-yellow-950 p-4 rounded-lg border border-yellow-700">
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-widest mb-4">Barres de Compétences</h2>
            
            {/* Front Bar */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-yellow-300 mb-3">Barre Avant</p>
              <div className="flex gap-2 bg-yellow-900 p-3 rounded border-2 border-yellow-700">
                {player.bars.front.map((skill) => (
                  <div key={skill} className="relative group">
                    <div className="bg-yellow-800 p-2 rounded border-2 border-yellow-600 hover:border-yellow-400 transition">
                      <Image
                        src={iconMap[skill] || ''}
                        alt={skill}
                        width={48}
                        height={48}
                        className="w-12 h-12"
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
              <p className="text-lg font-semibold text-yellow-300 mb-3">Barre Arrière</p>
              <div className="flex gap-2 bg-yellow-900 p-3 rounded border-2 border-yellow-700">
                {player.bars.back.map((skill) => (
                  <div key={skill} className="relative group">
                    <div className="bg-yellow-800 p-2 rounded border-2 border-yellow-600 hover:border-yellow-400 transition">
                      <Image
                        src={iconMap[skill] || ''}
                        alt={skill}
                        width={48}
                        height={48}
                        className="w-12 h-12"
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
          <div className="bg-yellow-950 p-4 rounded-lg border border-yellow-700">
            <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-widest mb-4">Points de Champion</h2>
            <div className="space-y-3">
              {player.championPoints.warior.length > 0 && (
                <div className="bg-yellow-900 p-3 rounded border border-yellow-700">
                  <span className="text-yellow-300 font-semibold text-base">Guerrier: </span>
                  <span className="text-yellow-100">{player.championPoints.warior.join(', ')}</span>
                </div>
              )}
              {player.championPoints.mage.length > 0 && (
                <div className="bg-yellow-900 p-3 rounded border border-yellow-700">
                  <span className="text-yellow-300 font-semibold text-base">Mage: </span>
                  <span className="text-yellow-100">{player.championPoints.mage.join(', ')}</span>
                </div>
              )}
              {player.championPoints.steed.length > 0 && (
                <div className="bg-yellow-900 p-3 rounded border border-yellow-700">
                  <span className="text-yellow-300 font-semibold text-base">Coursier: </span>
                  <span className="text-yellow-100">{player.championPoints.steed.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRaidSelection, esoRaids } from './RaidSelectionContext';

export default function LandingPage() {
  const router = useRouter();
  const { setSelectedRaid } = useRaidSelection();
  const [selectedRaid, setLocalSelectedRaid] = useState('');

  const handleRaidSelect = (raid: string) => {
    setLocalSelectedRaid(raid);
    setSelectedRaid(raid);
  };

  const handleStartRaid = () => {
    if (selectedRaid) {
      router.push('/raid-setup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Title */}
        <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-lg text-center mb-4">
          TTemplate
        </h1>
        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-12"></div>

        {/* Raid Selection Card */}
        <div className="bg-gradient-to-b from-amber-900 via-yellow-900 to-amber-950 border-2 border-yellow-600 rounded-lg p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-center">
            Sélectionnez un Raid
          </h2>

          <div className="mb-8">
            <label className="block text-lg font-bold text-yellow-300 mb-3">
              Raid
            </label>
            <select
              value={selectedRaid}
              onChange={(e) => handleRaidSelect(e.target.value)}
              className="w-full px-4 py-3 bg-yellow-950 border-2 border-yellow-600 rounded-lg text-yellow-100 font-semibold focus:outline-none focus:border-yellow-400 text-lg"
            >
              <option value="">-- Choisissez un raid --</option>
              {esoRaids.map((raid) => (
                <option key={raid} value={raid}>
                  {raid}
                </option>
              ))}
            </select>
          </div>

          {selectedRaid && (
            <button
              onClick={handleStartRaid}
              className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition text-lg"
            >
              Commencer le raid
            </button>
          )}

          {!selectedRaid && (
            <div className="w-full px-6 py-3 bg-gray-600 text-gray-300 font-bold rounded-lg text-center text-lg cursor-not-allowed">
              Sélectionnez un raid pour continuer
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-yellow-300 text-sm">
          <p>ESO Raid Template - Organisez vos équipes de raid</p>
        </div>
      </div>
    </div>
  );
}

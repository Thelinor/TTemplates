"use client";

import { useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRaid } from './RaidContext';
import { esoRaids } from '@/lib/raidConstants';

// Landing page: choix du raid puis navigation vers la configuration
export default function LandingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { setSelectedRaid, loadTemplate, template } = useRaid();

  const [raidChoice, setRaidChoice] = useState(template.raid.selectedRaid ?? '');

  const onSelectRaid = (raid: string) => {
    setRaidChoice(raid);
    setSelectedRaid(raid);
  };

  const onStartRaid = () => {
    if (raidChoice) router.push('/raid-setup');
  };

  const onImportJson = async () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = loadTemplate(text);
    const selected = parsed.raid.selectedRaid ?? '';
    setRaidChoice(selected);
    setSelectedRaid(selected);
    router.push('/raid-setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8 flex items-center justify-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onFileSelected}
      />

      <div className="max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-lg text-center mb-4">TTemplate</h1>
        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-12" />

        <div className="bg-gradient-to-b from-amber-900 via-yellow-900 to-amber-950 border-2 border-yellow-600 rounded-lg p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-center">Sélectionnez un Raid</h2>

          <div className="mb-8">
            <label className="block text-lg font-bold text-yellow-300 mb-3">Raid</label>
            <select
              value={raidChoice}
              onChange={(e) => onSelectRaid(e.target.value)}
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

          <div className="grid gap-3 md:grid-cols-2">
            {raidChoice ? (
              <button
                onClick={onStartRaid}
                className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition text-lg"
              >
                Commencer le raid
              </button>
            ) : (
              <div className="w-full px-6 py-3 bg-gray-600 text-gray-300 font-bold rounded-lg text-center text-lg cursor-not-allowed">
                Sélectionnez un raid pour continuer
              </div>
            )}

            <button
              type="button"
              onClick={onImportJson}
              className="w-full px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg transition text-lg"
            >
              Charger un JSON
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-yellow-300 text-sm">ESO Raid Template - Organisez vos équipes de raid</div>
      </div>
    </div>
  );
}

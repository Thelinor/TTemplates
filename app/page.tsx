"use client";

import { useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRaid } from './RaidContext';
import { defaultTemplateAssetByRaid, esoRaids } from '@/lib/raidConstants';

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

  const onStartRaid = async () => {
    if (!raidChoice) return;

    const staticTemplateAsset = defaultTemplateAssetByRaid[raidChoice];
    if (staticTemplateAsset) {
      try {
        const response = await fetch(`/default-templates/${staticTemplateAsset}`);
        if (response.ok) {
          const text = await response.text();
          const parsed = loadTemplate(text);
          setSelectedRaid(parsed.raid.selectedRaid ?? raidChoice);
        }
      } catch {
        // Fall back silently to the existing in-memory route if the static template is unavailable.
      }
    }

    router.push('/players');
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
    router.push('/players');
  };

  return (
    <div className="min-h-screen bg-[#050506] text-white p-8 flex items-center justify-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onFileSelected}
      />

      <div className="max-w-2xl w-full">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg text-center mb-4 tracking-wide">TTemplate</h1>
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d6b46b] to-transparent mb-12" />

        <div className="bg-[#0d0d0f] border border-[#d6b46b] rounded-lg p-8 shadow-2xl shadow-black/80">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Select a Raid</h2>

          <div className="mb-8">
            <label className="block text-lg font-bold text-[#f8f7f2] mb-3">Raid</label>
            <select
              value={raidChoice}
              onChange={(e) => onSelectRaid(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-[#d6b46b] rounded-lg text-white font-semibold focus:outline-none focus:border-[#f8f7f2] text-lg"
            >
              <option value="">-- Choose a raid --</option>
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
                className="w-full px-6 py-3 bg-[#d6b46b] hover:bg-[#f7e7ba] text-black font-bold rounded-lg transition text-lg"
              >
                Start raid
              </button>
            ) : (
              <div className="w-full px-6 py-3 bg-[#2a2a2c] text-[#b7b5aa] font-bold rounded-lg text-center text-lg cursor-not-allowed">
                Select a raid to continue
              </div>
            )}

            <button
              type="button"
              onClick={onImportJson}
              className="w-full px-6 py-3 bg-[#1c1c1f] hover:bg-[#2d2d30] text-white font-bold rounded-lg transition text-lg border border-white/40"
            >
              Load JSON
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-[#b7b5aa] text-sm">ESO Raid Template - Organize your raid teams</div>
      </div>
    </div>
  );
}

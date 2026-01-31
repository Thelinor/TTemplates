"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Liste des raids disponibles
export const esoRaids = [
  'Hel Ra Citadel',
  'Aetherian Archive',
  'Sanctum Ophidia',
  'Cloudrest',
  'Rockgrove',
  'Halls of Fabrication',
  'Sunspire',
  'Asylum Sanctorium',
  "Kyne's Aegis",
  'Dreadsail Reef',
  "Sanity's Edge",
  'Lucent Citadel',
  'Ossein Cage',
];

import { getRaidBackground as resolveRaidBackground } from '@/lib/raidDisplay';

interface RaidSelectionContextType {
  selectedRaid: string | null;
  setSelectedRaid: (raid: string) => void;
  // Renvoie le chemin de l'image de fond pour le raid sélectionné ('' si aucun)
  getRaidBackground: () => string;
}

const RaidSelectionContext = createContext<RaidSelectionContextType | undefined>(undefined);

export function RaidSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedRaid, setSelectedRaid] = useState<string | null>(null);

  const getRaidBackground = (): string => resolveRaidBackground(selectedRaid);

  return (
    <RaidSelectionContext.Provider value={{ selectedRaid, setSelectedRaid, getRaidBackground }}>
      {children}
    </RaidSelectionContext.Provider>
  );
}

export function useRaidSelection() {
  const context = useContext(RaidSelectionContext);
  if (!context) {
    throw new Error('useRaidSelection must be used within RaidSelectionProvider');
  }
  return context;
}

'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import raidData from '@/data/raidTemplate.json';

interface Player {
  id: number;
  name: string;
  classes: string[];
  role: string;
  sets: string[];
  bars: {
    front: string[];
    back: string[];
  };
  championPoints: {
    warior: string[];
    mage: string[];
    steed: string[];
  };
}

interface RaidContextType {
  players: Player[];
  updatePlayerName: (id: number, newName: string) => void;
  updatePlayerRole: (id: number, newRole: string) => void;
  updatePlayerClasses: (id: number, newClasses: string[]) => void;
}

const RaidContext = createContext<RaidContextType | undefined>(undefined);

export function RaidProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(raidData.players);

  const updatePlayerName = (id: number, newName: string) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, name: newName } : p
    ));
  };

  const updatePlayerRole = (id: number, newRole: string) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, role: newRole } : p
    ));
  };

  const updatePlayerClasses = (id: number, newClasses: string[]) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, classes: newClasses } : p
    ));
  };

  return (
    <RaidContext.Provider value={{ players, updatePlayerName, updatePlayerRole, updatePlayerClasses }}>
      {children}
    </RaidContext.Provider>
  );
}

export function useRaid() {
  const context = useContext(RaidContext);
  if (context === undefined) {
    throw new Error('useRaid must be used within RaidProvider');
  }
  return context;
}

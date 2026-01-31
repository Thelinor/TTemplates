"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import {
  RaidTemplateDocument,
  RaidPlayer,
  createEmptyTemplateDocument,
  normalizeTemplateDocument,
  exportTemplateDocument,
  createEmptyPlayer,
  createEmptyFightPlayerStuff,
  MundusStone,
  type RoleType,
  type SkillClasses,
  type GearPiece,
  type ChampionPointName,
  type ClassMasteries,
  createEmptyGearPiece,
  getChampionPointDisciplineFromSlot,
  getChampionPointDisciplineFromName,
  ChampionPointsByDiscipline,
  updateSetSlot,
  type SetSlot,
  type FightPlayerSetup,
  pasteFightPlayerSetup,
} from '@/lib/raidTemplate';

interface RaidContextType {
  template: RaidTemplateDocument;
  players: RaidPlayer[];
  selectedRaid: string | null;
  setSelectedRaid: (raidName: string | null) => void;
  setTemplate: (nextTemplate: RaidTemplateDocument) => void;
  loadTemplate: (json: string | object) => RaidTemplateDocument;
  exportTemplate: () => string;
  addPlayer: () => void;
  removePlayer: (id: number) => void;
  addFight: (name?: string) => string;
  removeFight: (fightName: string) => string | null;
  updatePlayer: (id: number, updater: (player: RaidPlayer) => RaidPlayer) => void;
  updatePlayerName: (id: number, newName: string) => void;
  updatePlayerRole: (id: number, newRole: RoleType) => void;
  updatePlayerClasses: (id: number, newClasses: SkillClasses) => void;
  updatePlayerClassMasteries: (id: number, newMasteries: ClassMasteries) => void;
  updatePlayerMundus: (id: number, newMundus: string) => void;
  updateFightPlayerStuff: (fightName: string, playerId: number, field: string, value: string | GearPiece | ChampionPointName) => void;
  pasteFightPlayerSetup: (fightName: string, playerId: number, setup: FightPlayerSetup) => void;
}

const RaidContext = createContext<RaidContextType | undefined>(undefined);

export function RaidProvider({ children }: { children: ReactNode }) {
  const [template, setTemplateState] = useState<RaidTemplateDocument>(() => normalizeTemplateDocument(createEmptyTemplateDocument()));

  const setTemplate = useCallback((nextTemplate: RaidTemplateDocument) => {
    setTemplateState(normalizeTemplateDocument(nextTemplate));
  }, []);

  const loadTemplate = useCallback((json: string | object) => {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    const normalized = normalizeTemplateDocument(parsed as Partial<RaidTemplateDocument>);
    setTemplateState(normalized);
    return normalized;
  }, []);

  const exportTemplate = useCallback(() => exportTemplateDocument(template), [template]);

  const players = useMemo(() => template.raid.players, [template.raid.players]);
  const selectedRaid = template.raid.selectedRaid ?? null;

  const addFight = useCallback((name?: string) => {
    let createdName = name?.trim() || 'New Encounter';

    setTemplateState((prev) => {
      const baseName = createdName || 'New Encounter';
      let candidate = baseName;
      let index = 2;
      while (prev.fights.some((fight) => fight.name === candidate)) {
        candidate = `${baseName} ${index}`;
        index += 1;
      }

      const newFight = {
        name: candidate,
        playersStuff: prev.raid.players.map((player) => createEmptyFightPlayerStuff(player)),
      };

      createdName = candidate;
      return {
        ...prev,
        fights: [...prev.fights, newFight],
      };
    });

    return createdName;
  }, [template.fights.length]);

  const removeFight = useCallback((fightName: string): string | null => {
    let nextName: string | null = null;

    setTemplateState((prev) => {
      if (prev.fights.length <= 1) return prev;

      const nextFights = prev.fights.filter((fight) => fight.name !== fightName);
      nextName = nextFights[0]?.name ?? null;
      return { ...prev, fights: nextFights };
    });

    return nextName;
  }, []);

  const addPlayer = useCallback(() => {
    setTemplateState((prev) => {
      const nextId = prev.raid.players.reduce((max, player) => Math.max(max, player.id), 0) + 1;
      const createdPlayer = createEmptyPlayer(nextId, `Player ${nextId}`);

      return {
        ...prev,
        raid: {
          ...prev.raid,
          players: [...prev.raid.players, createdPlayer],
        },
        fights: prev.fights.map((fight) => ({
          ...fight,
          playersStuff: [...fight.playersStuff, createEmptyFightPlayerStuff(createdPlayer)],
        })),
      };
    });
  }, []);

  const removePlayer = useCallback((id: number) => {
    setTemplateState((prev) => {
      const nextPlayers = prev.raid.players.filter((player) => player.id !== id);
      if (nextPlayers.length === prev.raid.players.length) {
        return prev;
      }

      return {
        ...prev,
        raid: {
          ...prev.raid,
          players: nextPlayers,
        },
        fights: prev.fights.map((fight) => ({
          ...fight,
          playersStuff: fight.playersStuff.filter((entry) => entry.id !== id),
        })),
      };
    });
  }, []);

  const setSelectedRaid = useCallback((raidName: string | null) => {
    setTemplateState((prev) => ({
      ...prev,
      raid: {
        ...prev.raid,
        selectedRaid: raidName,
        groupName: raidName ?? prev.raid.groupName,
      },
    }));
  }, []);

  const updatePlayer = useCallback((id: number, updater: (player: RaidPlayer) => RaidPlayer) => {
    let updatedPlayer: RaidPlayer | undefined;

    setTemplateState((prev) => {
      const nextPlayers = prev.raid.players.map((player) => {
        if (player.id !== id) return player;
        updatedPlayer = updater(player);
        return updatedPlayer;
      });

      const nextFights = prev.fights.map((fight) => ({
        ...fight,
        playersStuff: fight.playersStuff.map((item) => {
          if (item.id !== id) return item;
          if (!updatedPlayer) return item;
          return {
            ...item,
            name: updatedPlayer.name,
            role: updatedPlayer.role,
          };
        }),
      }));

      return {
        ...prev,
        raid: { ...prev.raid, players: nextPlayers },
        fights: nextFights,
      };
    });
  }, []);

  const updatePlayerName = useCallback((id: number, newName: string) => {
    updatePlayer(id, (player) => ({ ...player, name: newName }));
  }, [updatePlayer]);

  const updatePlayerRole = useCallback((id: number, newRole: RoleType) => {
    updatePlayer(id, (player) => ({ ...player, role: newRole }));
  }, [updatePlayer]);

  const updatePlayerClasses = useCallback((id: number, newClasses: SkillClasses) => {
    setTemplateState((prev) => ({
      ...prev,
      raid: {
        ...prev.raid,
        players: prev.raid.players.map((player) => (player.id === id ? { ...player, skillClasses: newClasses } : player)),
      },
    }));
  }, []);

  const updatePlayerClassMasteries = useCallback((id: number, newMasteries: ClassMasteries) => {
    setTemplateState((prev) => ({
      ...prev,
      raid: {
        ...prev.raid,
        players: prev.raid.players.map((player) => (player.id === id ? { ...player, classMasteries: newMasteries } : player)),
      },
    }));
  }, []);

  const updatePlayerMundus = useCallback((id: number, newMundus: string) => {
    setTemplateState((prev) => ({
      ...prev,
      raid: {
        ...prev.raid,
        players: prev.raid.players.map((player) => (player.id === id ? { ...player, mundus: newMundus as MundusStone } : player)),
      },
    }));
  }, []);

  const updateFightPlayerStuff = useCallback((fightName: string, playerId: number, field: string, value: string | GearPiece | ChampionPointName) => {
    setTemplateState((prev) => ({
      ...prev,
      fights: prev.fights.map((fight) => {
        if (fight.name !== fightName) return fight;
        return {
          ...fight,
          playersStuff: fight.playersStuff.map((item) => {
            if (item.id !== playerId) return item;
            if (field === 'food') return { ...item, food: typeof value === 'string' ? value : value.setName };
            if (field === 'potion') return { ...item, potion: typeof value === 'string' ? value : value.setName };
            if (field in item.sets) {
              const gear = typeof value === 'string' ? { ...createEmptyGearPiece(), setName: value } : value;
              return { ...item, sets: updateSetSlot(item.sets, field as SetSlot, gear) };
            }
            if (field in item.competencies) return { ...item, competencies: { ...item.competencies, [field]: typeof value === 'string' ? value : '' } };
            if (field in item.championPoints) {
              const slotDiscipline = getChampionPointDisciplineFromSlot(field);
              const selectedValue = typeof value === 'string' ? value : '';
              const selectedDiscipline = getChampionPointDisciplineFromName(selectedValue as ChampionPointName | '');

              if (slotDiscipline && selectedDiscipline && selectedDiscipline !== slotDiscipline) {
                return item;
              }

              if (selectedValue && !selectedDiscipline) {
                return item;
              }

              const category = field.startsWith('Blue') ? 'Blue' : field.startsWith('Red') ? 'Red' : field.startsWith('Green') ? 'Green' : '';
              if (category) {
                const existingCategoryValues = Object.entries(item.championPoints)
                  .filter(([slot]) => slot.startsWith(category))
                  .filter(([slot]) => slot !== field)
                  .map(([, cp]) => typeof cp === 'string' ? cp : '')
                  .filter(Boolean);

                if (existingCategoryValues.some((cp) => cp === selectedValue)) {
                  return item;
                }
              }

              return { ...item, championPoints: { ...item.championPoints, [field]: selectedValue } };
            }
            return item;
          }),
        };
      }),
    }));
  }, []);

  const pasteFightPlayerSetupForPlayer = useCallback((fightName: string, playerId: number, setup: FightPlayerSetup) => {
    setTemplateState((prev) => ({
      ...prev,
      fights: prev.fights.map((fight) => {
        if (fight.name !== fightName) return fight;

        return {
          ...fight,
          playersStuff: fight.playersStuff.map((item) => (
            item.id === playerId ? pasteFightPlayerSetup(item, setup) : item
          )),
        };
      }),
    }));
  }, []);

  return (
    <RaidContext.Provider value={{
      template,
      players,
      selectedRaid,
      setSelectedRaid,
      setTemplate,
      loadTemplate,
      exportTemplate,
      addPlayer,
      removePlayer,
      addFight,
      removeFight,
      updatePlayer,
      updatePlayerName,
      updatePlayerRole,
      updatePlayerClasses,
      updatePlayerClassMasteries,
      updatePlayerMundus,
      updateFightPlayerStuff,
      pasteFightPlayerSetup: pasteFightPlayerSetupForPlayer,
    }}>
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

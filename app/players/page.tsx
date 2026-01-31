'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRaid } from '@/app/RaidContext';
import { useState } from 'react';
import { getRaidBackground, getRaidDisplayName } from '@/lib/raidDisplay';
import { downloadTemplateAsJson, triggerJsonImport } from '@/lib/templateFileIO';
import { MUNDUS_ICON_MAP, SKILL_LINE_ICON_MAP, ROLE_ICON_MAP, CLASS_ICON_MAP } from '@/lib/iconMaps';
import BurgerMenu from '@/components/BurgerMenu';
import { ClassName, ClassSkillLine, CLASS_MASTERY_OPTIONS_BY_CLASS, type ClassMasteries, type ClassName as ClassNameType, type RoleType } from '@/lib/raidTemplate';

// ESO Classes and their skill lines
const esoClasses: Record<ClassNameType, ClassSkillLine[]> = {
  [ClassName.Templar]: ['Aedric Spear', "Dawn's Wrath", 'Restoring Light'],
  [ClassName.Sorcerer]: ['Daedric Summoning', 'Dark Magic', 'Storm Calling'],
  [ClassName.Nightblade]: ['Assassination', 'Shadowy Embrace', 'Siphoning'],
  [ClassName.Dragonknight]: ['Earthen Heart', 'Draconic Power', 'Ardent Flame'],
  [ClassName.Warden]: ['Green Balance', "Winter's Embrace", 'Animal Companions'],
  [ClassName.Necromancer]: ['Grave Lord', 'Living Death', "Bone Tyrant"],
  [ClassName.Arcanist]: ['Curative Runeforms', 'Herald of the Tomes', 'Soldier of Apocrypha'],
};

const skillLineIconMap = SKILL_LINE_ICON_MAP;
const classIconMap = CLASS_ICON_MAP;
const classMasteryOptionsByClass = CLASS_MASTERY_OPTIONS_BY_CLASS;

const getClassForSkillLine = (skillLine: string | undefined | null): ClassNameType | null => {
  if (!skillLine) return null;

  for (const [className, skillLines] of Object.entries(esoClasses) as Array<[ClassNameType, ClassSkillLine[]]>) {
    if (skillLines.some((line) => line === skillLine)) {
      return className;
    }
  }

  return null;
};

export default function PlayersPage() {
  const {
    template,
    players,
    addPlayer,
    removePlayer,
    updatePlayerName,
    updatePlayerRole,
    updatePlayerClasses,
    updatePlayerClassMasteries,
    updatePlayerMundus,
    loadTemplate,
  } = useRaid();
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [openMasteryDropdowns, setOpenMasteryDropdowns] = useState<{ [key: string]: boolean }>({});

  const allRoles: RoleType[] = ['Tank', 'Heal', 'DPS'];
  const mundusStoneOptions = [
    'The Apprentice',
    'The Atronach',
    'The Lady',
    'The Lord',
    'The Lover',
    'The Mage',
    'The Ritual',
    'The Serpent',
    'The Shadow',
    'The Steed',
    'The Thief',
    'The Tower',
    'The Warrior',
  ];

  const toggleDropdown = (playerId: number, index: number) => {
    const key = `${playerId}-${index}`;
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleMasteryDropdown = (playerId: number, className: string) => {
    const key = `${playerId}-mastery-${className}`;
    setOpenMasteryDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectClass = (playerId: number, index: number, skillLine: ClassSkillLine) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const classSlots = ['MainSkillClass', 'SecondSkillClass', 'ThirdSkillClass'] as const;
    const currentClasses = [
      player.skillClasses.MainSkillClass,
      player.skillClasses.SecondSkillClass,
      player.skillClasses.ThirdSkillClass,
    ];
    const existingSkillIndex = currentClasses.indexOf(skillLine);
    if (existingSkillIndex !== -1 && existingSkillIndex !== index) {
      return;
    }

    const nextSkillClasses = { ...player.skillClasses, [classSlots[index]]: skillLine };
    updatePlayerClasses(playerId, nextSkillClasses);

    const key = `${playerId}-${index}`;
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: false
    }));
  };

  const updateClassMastery = (playerId: number, className: string, masteryName: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const currentFirst = player.classMasteries.firstClassMastery;
    const currentSecond = player.classMasteries.secondClassMastery;

    const nextMasteries: ClassMasteries = {
      firstClassMastery: currentFirst,
      secondClassMastery: currentSecond,
    };

    const selected = [currentFirst, currentSecond].includes(masteryName);

    if (selected) {
      if (currentFirst === masteryName) nextMasteries.firstClassMastery = '';
      if (currentSecond === masteryName) nextMasteries.secondClassMastery = '';
    } else if (!currentFirst || currentFirst === className) {
      nextMasteries.firstClassMastery = masteryName;
    } else if (!currentSecond || currentSecond === className) {
      nextMasteries.secondClassMastery = masteryName;
    } else {
      nextMasteries.secondClassMastery = masteryName;
    }

    updatePlayerClassMasteries(playerId, nextMasteries);
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({});
    setOpenMasteryDropdowns({});
  };

  const handleExportJson = () => {
    downloadTemplateAsJson(template);
  };

  const handleImportJson = () => {
    triggerJsonImport((text) => {
      loadTemplate(text);
    });
  };

  const raidBackground = getRaidBackground(template.raid.selectedRaid);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-8"
      style={{
        backgroundImage: raidBackground ? `url(${raidBackground})` : 'linear-gradient(to bottom right, #050506, #111111, #050506)',
      }}
    >
      <div className="fixed inset-0 bg-black/75 -z-10"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-end mb-4">
          <BurgerMenu onExport={handleExportJson} onImport={handleImportJson} />
        </div>
        {(Object.values(openDropdowns).some(v => v) || Object.values(openMasteryDropdowns).some(v => v)) && (
          <div 
            className="fixed inset-0 z-30" 
            onClick={closeAllDropdowns}
          />
        )}

        <h1 className="text-4xl font-bold text-[#f8f7f2] mb-2 text-center drop-shadow-lg">
          {getRaidDisplayName(template.raid.selectedRaid, template.raid.groupName)}
        </h1>
        <h2 className="text-lg text-[#d6b46b] text-center mb-4 drop-shadow-lg">Character Management</h2>
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d6b46b] to-transparent mb-8"></div>

        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <Link
            href="/encounters"
            className="px-6 py-3 bg-[#d6b46b] hover:bg-[#f7e7ba] text-black font-bold rounded-lg transition"
          >
            Encounter View
          </Link>
          <button
            type="button"
            onClick={addPlayer}
            className="px-6 py-3 bg-[#1b1b1b] hover:bg-[#30302f] text-white font-bold rounded-lg transition border border-[#d6b46b]"
          >
            + Add Character
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => {
            const currentPlayerClasses = [
              player.skillClasses.MainSkillClass,
              player.skillClasses.SecondSkillClass,
              player.skillClasses.ThirdSkillClass,
            ];
            const firstFilledIndex = currentPlayerClasses.findIndex(Boolean);
            const primaryClass = firstFilledIndex >= 0 ? getClassForSkillLine(currentPlayerClasses[firstFilledIndex]) : null;
            const sameClassMasteries = primaryClass && currentPlayerClasses.filter(Boolean).length === 3 && currentPlayerClasses.filter(Boolean).every(skillLine => getClassForSkillLine(skillLine) === primaryClass);

            return (
              <div 
                key={player.id}
                className="bg-[#111111] border-2 border-[#d6b46b] rounded-lg p-4 shadow-2xl relative"
              >
                <button
                  type="button"
                  onClick={() => removePlayer(player.id)}
                  className="absolute top-3 right-3 z-10 px-2 py-1 text-[10px] font-bold rounded bg-[#2b0e0e] hover:bg-[#3d1414] text-white transition border border-[#b76b6b]"
                >
                  Supprimer
                </button>

                <div className="mb-3">
                  <label className="text-xs font-bold text-[#f8f7f2] uppercase block mb-1">Name</label>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="text-center font-bold text-[#f8f7f2] bg-[#111111] border border-[#d6b46b] rounded px-2 py-1 w-full focus:outline-none focus:border-[#f8f7f2]"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-xs font-bold text-yellow-400 uppercase block mb-2">Role</label>
                  <div className="flex gap-2 justify-center">
                    {allRoles.map((role) => {
                      const isSelected = player.role === role;
                      let bgColor = 'bg-[#111111]';
                      let borderColor = 'border-[#d6b46b]';
                      let selectedBg = 'bg-[#d6b46b]';
                      let hoverBorder = 'hover:border-[#f8f7f2]';

                      if (role === 'Tank') {
                        bgColor = 'bg-[#221313]';
                        borderColor = 'border-[#b76b6b]';
                        selectedBg = 'bg-[#b76b6b]';
                        hoverBorder = 'hover:border-[#f8f7f2]';
                      } else if (role === 'Heal') {
                        bgColor = 'bg-[#0f211d]';
                        borderColor = 'border-[#95b3a3]';
                        selectedBg = 'bg-[#95b3a3]';
                        hoverBorder = 'hover:border-[#f8f7f2]';
                      } else if (role === 'DPS') {
                        bgColor = 'bg-[#16171c]';
                        borderColor = 'border-[#a8a8b2]';
                        selectedBg = 'bg-[#a8a8b2]';
                        hoverBorder = 'hover:border-[#f8f7f2]';
                      }
                      
                      return (
                        <button
                          key={role}
                          onClick={() => updatePlayerRole(player.id, role)}
                          className={`relative group transition ${isSelected ? 'scale-110' : ''}`}
                        >
                          <div className={`w-14 h-14 rounded border-2 transition flex items-center justify-center cursor-pointer hover:scale-110 transform ${borderColor} ${
                            isSelected 
                              ? selectedBg
                              : `${bgColor} ${hoverBorder}`
                          }`}>
                            <Image
                              src={ROLE_ICON_MAP[role] || ''}
                              alt={role}
                              width={40}
                              height={40}
                              className="w-10 h-10"
                            />
                          </div>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-yellow-900">
                              ✓
                            </div>
                          )}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            {role}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-yellow-400 uppercase block mb-2">Skill Lines</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex gap-2 flex-wrap">
                      {[0, 1, 2].map((index) => {
                        const selectedSkillLine = currentPlayerClasses[index];
                        const key = `${player.id}-${index}`;
                        const isOpen = openDropdowns[key];
                        const isPrimarySkillLine = index === firstFilledIndex && !!selectedSkillLine;
                        const isDuplicate = !!selectedSkillLine && currentPlayerClasses.indexOf(selectedSkillLine) !== index;

                        return (
                          <div key={index} className="relative">
                            <button
                              onClick={() => toggleDropdown(player.id, index)}
                              className="relative group"
                              type="button"
                            >
                              <div
                                className={`w-16 h-16 bg-yellow-950 border-[3px] rounded hover:border-yellow-400 transition flex items-center justify-center cursor-pointer hover:scale-110 transform transition-transform ${
                                  isPrimarySkillLine ? 'border-white shadow-[0_0_0_3px_rgba(255,255,255,0.35)]' : 'border-yellow-600'
                                } ${isDuplicate ? 'opacity-60' : ''}`}
                                style={{
                                  backgroundImage: selectedSkillLine && skillLineIconMap[selectedSkillLine] ? `url(${skillLineIconMap[selectedSkillLine]})` : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              >
                                {!selectedSkillLine && (
                                  <span className="text-lg text-yellow-400 font-bold">+</span>
                                )}
                              </div>
                              {selectedSkillLine && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                  {selectedSkillLine}
                                </div>
                              )}
                            </button>

                            {isOpen && (
                              <div className="absolute top-full mt-2 left-0 bg-gray-800 border-2 border-yellow-500 rounded shadow-2xl z-50 min-w-max max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
                                style={{
                                  animation: 'slideDown 0.2s ease-out'
                                }}
                              >
                                {Object.entries(esoClasses).map(([className, skillLines]) => (
                                  <div key={className}>
                                    <div className="px-3 py-2 text-xs font-semibold text-yellow-300 border-b border-yellow-600 bg-gray-900 sticky top-0">
                                      {className}
                                    </div>
                                    {skillLines.map(skillLine => {
                                      const disabled = currentPlayerClasses.includes(skillLine) && currentPlayerClasses.indexOf(skillLine) !== index;

                                      return (
                                        <button
                                          key={skillLine}
                                          type="button"
                                          disabled={disabled}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!disabled) {
                                              selectClass(player.id, index, skillLine);
                                            }
                                          }}
                                          className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 transition ${disabled ? 'text-gray-500 cursor-not-allowed opacity-60' : 'text-yellow-200 hover:bg-yellow-700'}`}
                                        >
                                          {skillLineIconMap[skillLine] && (
                                            <Image
                                              src={skillLineIconMap[skillLine]}
                                              alt={skillLine}
                                              width={24}
                                              height={24}
                                              className="w-6 h-6"
                                            />
                                          )}
                                          <span>{skillLine}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {primaryClass && classIconMap[primaryClass] && (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-yellow-300">Class</span>
                        {sameClassMasteries ? (
                          <div className="relative group">
                            <button
                              type="button"
                              onClick={() => toggleMasteryDropdown(player.id, primaryClass)}
                              className="w-14 h-14 rounded-lg border-2 border-yellow-600 bg-yellow-950 flex items-center justify-center overflow-hidden hover:border-yellow-400 transition cursor-pointer"
                            >
                              <Image
                                src={classIconMap[primaryClass]}
                                alt={primaryClass}
                                width={56}
                                height={56}
                                className="w-11 h-11 object-contain"
                              />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                              {primaryClass}
                            </div>

                            {openMasteryDropdowns[`${player.id}-mastery-${primaryClass}`] && (
                              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-800 border-2 border-yellow-500 rounded shadow-2xl z-50 min-w-[210px] max-h-80 overflow-y-auto">
                                {classMasteryOptionsByClass[primaryClass]?.map((masteryName) => {
                                  const selected =
                                    player.classMasteries.firstClassMastery === masteryName ||
                                    player.classMasteries.secondClassMastery === masteryName;
                                  const disabled =
                                    !selected &&
                                    !!player.classMasteries.firstClassMastery &&
                                    !!player.classMasteries.secondClassMastery;

                                  return (
                                    <button
                                      key={`${primaryClass}-${masteryName}`}
                                      type="button"
                                      disabled={disabled}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateClassMastery(player.id, primaryClass, masteryName);
                                      }}
                                      className={`w-full px-3 py-2 text-left text-sm transition ${selected ? 'bg-yellow-700 text-yellow-50' : disabled ? 'text-gray-500 cursor-not-allowed opacity-60' : 'text-yellow-200 hover:bg-yellow-700'}`}
                                    >
                                      {masteryName}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative group">
                            <div className="w-14 h-14 rounded-lg border-2 border-yellow-600 bg-yellow-950 flex items-center justify-center overflow-hidden">
                              <Image
                                src={classIconMap[primaryClass]}
                                alt={primaryClass}
                                width={56}
                                height={56}
                                className="w-11 h-11 object-contain"
                              />
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                              {primaryClass}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-yellow-300 block mb-1">Mundus Stone</label>
                    {player.mundus && MUNDUS_ICON_MAP[player.mundus] && (
                      <Image
                        src={MUNDUS_ICON_MAP[player.mundus]}
                        alt={player.mundus}
                        width={40}
                        height={40}
                        className="mb-2 h-10 w-10 object-contain"
                      />
                    )}
                    <select
                      value={player.mundus ?? ''}
                      onChange={(e) => updatePlayerMundus(player.id, e.target.value)}
                      className="w-full bg-yellow-950 border border-yellow-600 rounded px-2 py-1 text-sm text-yellow-100 focus:outline-none focus:border-yellow-400"
                    >
                      <option value="">Select</option>
                      {mundusStoneOptions.map((stone) => (
                        <option key={stone} value={stone}>
                          {stone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

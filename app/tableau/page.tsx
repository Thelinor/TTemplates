'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRaid } from '@/app/RaidContext';
import { useRaidSelection } from '@/app/RaidSelectionContext';
import raidData from '@/data/raidTemplate.json';
import { useState, useEffect } from 'react';
import { getAllAbilityCategories, abilityCategories, AbilityCategory, getAbilityImagePath } from '@/lib/abilityCategories';
import { RaidTemplate, createTemplateFromRaidData } from '@/lib/templateTypes';

// Skill line icons from raid-setup
const skillLineIconMap: { [key: string]: string } = {
  // DK
  'Earthen Heart': '/spliticons/ability/dragonknight/013_a.png',
  'Draconic Power': '/spliticons/ability/dragonknight/007_b.png',
  'Ardent Flame': '/spliticons/ability/dragonknight/001_b.png',
  // Templar
  'Aedric Spear': '/spliticons/ability/templar/radiant_ward.png',
  "Dawn's Wrath": '/spliticons/ability/templar/power_of_the_light.png',
  "Purifying Light": '/spliticons/ability/templar/breath_of_life.png',
  // Sorcerer
  'Daedric Summoning': '/spliticons/ability/sorcerer/explosive_curse.png',
  'Dark Magic': '/spliticons/ability/sorcerer/thunderstomp.png',
  'Storm Calling': '/spliticons/ability/sorcerer/thundering_presence.png',
  // Nightblade
  'Assassination': '/spliticons/ability/nightblade/007_a.png',
  'Shadowy Embrace': '/spliticons/ability/nightblade/001_a.png',
  'Siphoning': '/spliticons/ability/nightblade/003_b.png',
  // Warden
  'Green Balance': '/spliticons/ability/warden/008.png',
  "Winter's Embrace": '/spliticons/ability/warden/002.png',
  'Animal Companions': '/spliticons/ability/warden/015_b.png',
  // Necromancer
  'Grave Lord': '/spliticons/ability/necromancer/001_a.png',
  'Living Death': '/spliticons/ability/necromancer/013_a.png',
  "Bone Tyrant": '/spliticons/ability/necromancer/008_b.png',
  // Arcanist
  "Curative Runeforms": '/spliticons/ability/arcanist/013.png',
  "Herald of the Tomes": '/spliticons/ability/arcanist/002_b.png',
  "Soldier of Apocrypha": '/spliticons/ability/arcanist/012.png',
};

const roleIconMap: { [key: string]: string } = {
  'Tank': '/spliticons/lfg/lfg_tank_down_no_glow_64.png',
  'Heal': '/spliticons/lfg/lfg_healer_down_no_glow_64.png',
  'DPS': '/spliticons/lfg/lfg_dps_down_no_glow_64.png',
};

// ESO Sets list for equipment
const esoSets = [
  'Heartland Conqueror',
  'Spriggans Thorns',
  'Burning Spell Weave',
  'Mothers Sorrow',
  'Seducer',
  'Julianos',
  'Martial Knowledge',
  'Hunding\'s Rage',
  'Way of Martial Arts',
  'Stormfist',
  'Ebon Armory',
  'Plague Doctor',
  'Healing Mage',
  'Twilight Remedy',
  'Olorime',
  'Spell Precision',
  'Critical Leech',
  'Daedric Trickery',
  'Darloc Brae',
  'Robes of Bahraha\'s Curse',
  'Deadlight',
  'Nereid\'s Kiss',
  'Elemental Siege',
  'Clever Alchemist',
];

const equipmentSlots = [
  'Head',
  'Shoulders',
  'Chest',
  'Gloves',
  'Waist',
  'Legs',
  'Boots',
  'Ring 1',
  'Ring 2',
  'Necklace',
  'Main Bar Weapon 1',
  'Main Bar Weapon 2',
  'Back Bar Weapon 1',
  'Back Bar Weapon 2',
];

export default function TableauView() {
  const { players } = useRaid();
  const { getRaidBackground } = useRaidSelection();
  
  // Main raid template - single source of truth, exportable/importable
  const [template, setTemplate] = useState<RaidTemplate | null>(null);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [setupEditPlayerId, setSetupEditPlayerId] = useState<number | null>(null);
  const [cpEditPlayerId, setCpEditPlayerId] = useState<number | null>(null);
  const [skillEditState, setSkillEditState] = useState<{ playerId: number; skillIndex: number } | null>(null);
  
  // Temporary edit data - only used during edit mode
  const [editTemplate, setEditTemplate] = useState<RaidTemplate | null>(null);

  const raidBackground = getRaidBackground();

  // Initialize template from raid data
  useEffect(() => {
    if (players.length > 0 && !template) {
      const newTemplate = createTemplateFromRaidData(
        raidData.raidName,
        players,
        equipmentSlots
      );
      setTemplate(newTemplate);
    }
  }, [players, template]);

  // Enter edit mode
  const handleEnterEditMode = () => {
    if (template) {
      setEditTemplate(JSON.parse(JSON.stringify(template)));
      setIsEditMode(true);
    }
  };

  // Save changes and exit edit mode
  const handleSaveChanges = () => {
    if (editTemplate) {
      setTemplate(JSON.parse(JSON.stringify(editTemplate)));
    }
    setEditTemplate(null);
    setIsEditMode(false);
  };

  // Cancel edit and discard changes
  const handleCancelEdit = () => {
    setEditTemplate(null);
    setIsEditMode(false);
  };

  // Get current data to display (edit mode or preview mode)
  const getCurrentTemplate = (): RaidTemplate | null => {
    return isEditMode ? editTemplate : template;
  };

  // Helper to create a deep copy of template
  const deepCopyTemplate = (tmpl: RaidTemplate): RaidTemplate => {
    return {
      raidName: tmpl.raidName,
      players: {
        ...Object.fromEntries(
          Object.entries(tmpl.players).map(([id, p]) => [
            Number(id),
            { ...p }
          ])
        )
      }
    };
  };

  // Modify field in edit template
  const handleFieldChange = (playerId: number, field: string, value: string, subIndex?: number | string) => {
    if (!editTemplate) return;
    
    const playerConfig = editTemplate.players[playerId];
    if (!playerConfig) return;

    if (field === 'championPoints') {
      const cpType = value as keyof typeof playerConfig.championPoints;
      if (typeof subIndex === 'number') {
        playerConfig.championPoints[cpType][subIndex] = value;
      }
    } else if (field === 'sets') {
      if (typeof subIndex === 'number') {
        playerConfig.sets[subIndex] = value;
      }
    } else if (field === 'setup') {
      playerConfig.setup[value as string] = subIndex as string;
    } else if (field === 'food' || field === 'potion') {
      if (field === 'food') {
        playerConfig.food = value;
      } else {
        playerConfig.potion = value;
      }
    }
    
    setEditTemplate({ ...editTemplate });
  };

  // Only render if template is loaded
  if (!template) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
  }

  const currentTemplate = getCurrentTemplate();
  if (!currentTemplate) return null;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed p-8"
      style={{
        backgroundImage: raidBackground ? `url(${raidBackground})` : 'linear-gradient(to bottom right, #111827, #78350f, #111827)',
      }}
    >
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/60 -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">
            {currentTemplate.raidName}
          </h1>
          <div className="flex gap-4">
            {isEditMode ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-3 font-bold rounded-lg transition bg-green-600 hover:bg-green-500 text-white"
                >
                  ✓ Aperçu
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 font-bold rounded-lg transition bg-red-600 hover:bg-red-500 text-white"
                >
                  ✕ Annuler
                </button>
              </>
            ) : (
              <button
                onClick={handleEnterEditMode}
                className="px-6 py-3 font-bold rounded-lg transition bg-blue-600 hover:bg-blue-500 text-white"
              >
                ✎ Éditer
              </button>
            )}
            <Link 
              href="/" 
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition"
            >
              ← Retour
            </Link>
          </div>
        </div>
        
        <div className="h-1 bg-linear-to-r from-transparent via-yellow-500 to-transparent mb-8"></div>

        {/* Table */}
        <div className="overflow-x-auto bg-amber-950 border-2 border-yellow-600 rounded-lg shadow-2xl">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b-2 border-yellow-600 bg-linear-to-r from-amber-900 to-yellow-900">
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Nom</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Rôle</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Classes</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Sets</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Compétences</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Points de Champion</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Nourriture</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Potion</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {Object.values(currentTemplate.players).map((playerConfig) => (
                <tr 
                  key={playerConfig.id}
                  className="border-b border-yellow-700 align-top"
                >
                  {/* Name */}
                  <td className="px-4 py-6 text-yellow-100 font-semibold">{playerConfig.name}</td>

                  {/* Role */}
                  <td className="px-4 py-6">
                    <div className="relative group inline-block">
                      <Image
                        src={roleIconMap[playerConfig.role] || ''}
                        alt={playerConfig.role}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                        {playerConfig.role}
                      </div>
                    </div>
                  </td>

                  {/* Classes */}
                  <td className="px-4 py-6">
                    <div className="flex gap-2">
                      {playerConfig.classes.map((cls) => (
                        <div key={cls} className="relative group">
                          <div className="bg-yellow-950 p-2 rounded border border-yellow-600 hover:border-yellow-400 transition">
                            <Image
                              src={skillLineIconMap[cls] || ''}
                              alt={cls}
                              width={32}
                              height={32}
                              className="w-8 h-8"
                            />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            {cls}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Sets */}
                  <td className="px-4 py-6">
                    {/* EDIT MODE - Sets */}
                    {isEditMode ? (
                      <button
                        onClick={() => setSetupEditPlayerId(playerConfig.id)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-sm transition"
                      >
                        ⚙ EDIT SETUP
                      </button>
                    ) : (
                      /* OVERVIEW MODE - Sets (READ-ONLY) */
                      <div className="flex flex-col gap-1">
                        {playerConfig.sets.map((setName, idx) => (
                          <div key={`set-${idx}`} className="text-xs text-yellow-100 truncate max-w-32" title={setName}>
                            {setName || '-'}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Skills */}
                  <td className="px-4 py-6">
                    <div className="flex flex-col gap-1">
                      {/* Row 1: 5 skills + 1 empty */}
                      <div className="flex gap-1 justify-start">
                        <div className="flex gap-1">
                          {Array(5).fill(null).map((_, idx) => {
                            // Get data from edit mode if editing, otherwise from saved template
                            const sourceData = isEditMode 
                              ? editTemplate?.players[playerConfig.id]
                              : playerConfig;
                            const skill = sourceData?.skills[idx];
                            
                            let skillName = '';
                            let skillCategory: AbilityCategory | null = null;
                            
                            if (skill && typeof skill === 'object' && 'ability' in skill) {
                              skillName = skill.ability;
                              skillCategory = skill.category;
                            }
                            
                            return (
                              <div 
                                key={`skill-${idx}`} 
                                className="relative group w-7 h-7"
                                onClick={() => isEditMode && setSkillEditState({ playerId: playerConfig.id, skillIndex: idx })}
                              >
                                <div className={`bg-yellow-950 rounded border w-full h-full flex items-center justify-center p-0.5 ${
                                  isEditMode 
                                    ? 'border-yellow-600 hover:border-yellow-400 hover:cursor-pointer transition' 
                                    : 'border-yellow-600'
                                }`}>
                                  {skillName && skillCategory && (
                                    <Image
                                      src={getAbilityImagePath(skillCategory, skillName)}
                                      alt={skillName}
                                      width={24}
                                      height={24}
                                      className="w-6 h-6"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                                  {skillName || 'Empty'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className={`ml-6 w-7 h-7 bg-yellow-950 rounded border ${
                          isEditMode 
                            ? 'border-yellow-600 hover:border-yellow-400 hover:cursor-pointer transition' 
                            : 'border-yellow-600'
                        }`}
                        onClick={() => isEditMode && setSkillEditState({ playerId: playerConfig.id, skillIndex: 10 })}
                        ></div>
                      </div>
                      {/* Row 2: 5 skills + 1 ulti */}
                      <div className="flex gap-1 justify-start">
                        <div className="flex gap-1">
                          {Array(5).fill(null).map((_, idx) => {
                            // Get data from edit mode if editing, otherwise from saved template
                            const sourceData = isEditMode 
                              ? editTemplate?.players[playerConfig.id]
                              : playerConfig;
                            const skill = sourceData?.skills[idx + 5];
                            
                            let skillName = '';
                            let skillCategory: AbilityCategory | null = null;
                            
                            if (skill && typeof skill === 'object' && 'ability' in skill) {
                              skillName = skill.ability;
                              skillCategory = skill.category;
                            }
                            
                            return (
                              <div 
                                key={`skill-${idx + 5}`} 
                                className="relative group w-7 h-7"
                                onClick={() => isEditMode && setSkillEditState({ playerId: playerConfig.id, skillIndex: idx + 5 })}
                              >
                                <div className={`bg-yellow-950 rounded border w-full h-full flex items-center justify-center p-0.5 ${
                                  isEditMode 
                                    ? 'border-yellow-600 hover:border-yellow-400 hover:cursor-pointer transition' 
                                    : 'border-yellow-600'
                                }`}>
                                  {skillName && isEditMode && skillCategory && (
                                    <Image
                                      src={getAbilityImagePath(skillCategory, skillName)}
                                      alt={skillName}
                                      width={24}
                                      height={24}
                                      className="w-6 h-6"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                                  {skillName || 'Empty'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* 1 Ulti slot */}
                        <div className={`ml-6 w-7 h-7 bg-yellow-950 rounded border ${
                          isEditMode 
                            ? 'border-yellow-600 hover:border-yellow-400 hover:cursor-pointer transition' 
                            : 'border-yellow-600'
                        }`}
                        onClick={() => isEditMode && setSkillEditState({ playerId: playerConfig.id, skillIndex: 11 })}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Champion Points */}
                  <td className="px-2 py-6">
                    {/* EDIT MODE - Champion Points */}
                    {isEditMode ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => setCpEditPlayerId(playerConfig.id)}
                          className="w-12 h-12 bg-blue-950 rounded border-2 border-blue-600 hover:border-blue-400 transition flex items-center justify-center text-xs font-bold text-blue-300"
                          title="Edit Warrior CP"
                        >
                          W
                        </button>
                        <button
                          onClick={() => setCpEditPlayerId(playerConfig.id)}
                          className="w-12 h-12 bg-red-950 rounded border-2 border-red-600 hover:border-red-400 transition flex items-center justify-center text-xs font-bold text-red-300"
                          title="Edit Mage CP"
                        >
                          M
                        </button>
                        <button
                          onClick={() => setCpEditPlayerId(playerConfig.id)}
                          className="w-12 h-12 bg-green-950 rounded border-2 border-green-600 hover:border-green-400 transition flex items-center justify-center text-xs font-bold text-green-300"
                          title="Edit Steed CP"
                        >
                          S
                        </button>
                      </div>
                    ) : (
                      /* OVERVIEW MODE - Champion Points (READ-ONLY) */
                      <div className="flex gap-1">
                        <div
                          className="w-12 h-12 bg-blue-950 rounded border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-blue-300"
                          title="Warrior CP"
                        >
                          W
                        </div>
                        <div
                          className="w-12 h-12 bg-red-950 rounded border-2 border-red-600 flex items-center justify-center text-xs font-bold text-red-300"
                          title="Mage CP"
                        >
                          M
                        </div>
                        <div
                          className="w-12 h-12 bg-green-950 rounded border-2 border-green-600 flex items-center justify-center text-xs font-bold text-green-300"
                          title="Steed CP"
                        >
                          S
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Food */}
                  <td className="px-4 py-6">
                    {isEditMode ? (
                      <input
                        type="text"
                        placeholder="Nourriture"
                        defaultValue={editTemplate?.players[playerConfig.id]?.food || ''}
                        onChange={(e) => handleFieldChange(playerConfig.id, 'food', e.target.value)}
                        className="w-full bg-yellow-950 border border-yellow-600 rounded px-2 py-1 text-yellow-100 text-xs focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <div className="relative group inline-block">
                        <div className="bg-yellow-950 p-1 rounded border border-yellow-600 hover:border-yellow-400 transition">
                          <Image
                            src="/spliticons/store_tricolor_food_01.png"
                            alt="Food"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                          />
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                          {playerConfig.food || 'Nourriture'}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Potion */}
                  <td className="px-4 py-6">
                    {isEditMode ? (
                      <input
                        type="text"
                        placeholder="Potion"
                        defaultValue={editTemplate?.players[playerConfig.id]?.potion || ''}
                        onChange={(e) => handleFieldChange(playerConfig.id, 'potion', e.target.value)}
                        className="w-full bg-yellow-950 border border-yellow-600 rounded px-2 py-1 text-yellow-100 text-xs focus:outline-none focus:border-yellow-400"
                      />
                    ) : (
                      <div className="relative group inline-block">
                        <div className="bg-yellow-950 p-1 rounded border border-yellow-600 hover:border-yellow-400 transition">
                          <Image
                            src="/spliticons/consumable/potion_001_type_005.png"
                            alt="Potion"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                          />
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                          {playerConfig.potion || 'Potion'}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Setup Edit Modal */}
        {setupEditPlayerId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-linear-to-b from-amber-900 to-yellow-900 border-2 border-yellow-600 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-400">Edit Equipment Setup</h2>
                <button
                  onClick={() => setSetupEditPlayerId(null)}
                  className="text-yellow-400 hover:text-yellow-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentSlots.map((slot) => (
                  <div key={slot} className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-yellow-300">{slot}</label>
                    <select
                      defaultValue={editTemplate?.players[setupEditPlayerId]?.setup[slot] || ''}
                      onChange={(e) => handleFieldChange(setupEditPlayerId, 'setup', slot, e.target.value)}
                      className="bg-yellow-950 border border-yellow-600 rounded px-3 py-2 text-yellow-100 focus:outline-none focus:border-yellow-400"
                    >
                      <option value="">-- Select Set --</option>
                      {esoSets.map((set) => (
                        <option key={set} value={set}>
                          {set}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setSetupEditPlayerId(null)}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition"
                >
                  Done
                </button>
                <button
                  onClick={() => setSetupEditPlayerId(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CP Edit Modal */}
        {cpEditPlayerId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-linear-to-b from-amber-900 to-yellow-900 border-2 border-yellow-600 rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-400">Edit Champion Points</h2>
                <button
                  onClick={() => setCpEditPlayerId(null)}
                  className="text-yellow-400 hover:text-yellow-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Warrior - Blue */}
                <div className="bg-blue-950 p-3 rounded border-2 border-blue-600">
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Warrior</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={`warrior-${idx}`} className="flex flex-col">
                        <label className="text-xs font-bold text-blue-300 mb-1">CP {idx + 1}</label>
                        <input
                          type="text"
                          defaultValue={editTemplate?.players[cpEditPlayerId]?.championPoints.warior[idx] || ''}
                          onChange={(e) => {
                            const data = editTemplate?.players[cpEditPlayerId];
                            data.championPoints.warior[idx] = e.target.value;
                            // Update handled above
                          }}
                          className="bg-blue-900 rounded border border-blue-500 text-sm font-bold text-blue-300 px-2 py-1 focus:outline-none focus:border-blue-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mage - Red */}
                <div className="bg-red-950 p-3 rounded border-2 border-red-600">
                  <h3 className="text-lg font-bold text-red-300 mb-2">Mage</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={`mage-${idx}`} className="flex flex-col">
                        <label className="text-xs font-bold text-red-300 mb-1">CP {idx + 1}</label>
                        <input
                          type="text"
                          defaultValue={editTemplate?.players[cpEditPlayerId]?.championPoints.mage[idx] || ''}
                          onChange={(e) => {
                            const data = editTemplate?.players[cpEditPlayerId];
                            data.championPoints.mage[idx] = e.target.value;
                            // Update handled above
                          }}
                          className="bg-red-900 rounded border border-red-500 text-sm font-bold text-red-300 px-2 py-1 focus:outline-none focus:border-red-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steed - Green */}
                <div className="bg-green-950 p-3 rounded border-2 border-green-600">
                  <h3 className="text-lg font-bold text-green-300 mb-2">Steed</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={`steed-${idx}`} className="flex flex-col">
                        <label className="text-xs font-bold text-green-300 mb-1">CP {idx + 1}</label>
                        <input
                          type="text"
                          defaultValue={editTemplate?.players[cpEditPlayerId]?.championPoints.steed[idx] || ''}
                          onChange={(e) => {
                            const data = editTemplate?.players[cpEditPlayerId];
                            data.championPoints.steed[idx] = e.target.value;
                            // Update handled above
                          }}
                          className="bg-green-900 rounded border border-green-500 text-sm font-bold text-green-300 px-2 py-1 focus:outline-none focus:border-green-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCpEditPlayerId(null)}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded transition"
                >
                  Done
                </button>
                <button
                  onClick={() => setCpEditPlayerId(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skill Edit Modal */}
        {skillEditState !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-linear-to-b from-amber-900 to-yellow-900 border-2 border-yellow-600 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-400">Select Ability - Skill {skillEditState.skillIndex + 1}</h2>
                <button
                  onClick={() => setSkillEditState(null)}
                  className="text-yellow-400 hover:text-yellow-300 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-yellow-300 mb-3">Select Category</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {getAllAbilityCategories().map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        const data = editTemplate?.players[skillEditState.playerId];
                        const firstAbility = abilityCategories[category][0];
                        if (firstAbility) {
                          data.skills[skillEditState.skillIndex] = {
                            category,
                            ability: firstAbility,
                          };
                          setEditTemplate({ ...editData, [skillEditState.playerId]: data });
                        }
                      }}
                      className="px-3 py-2 bg-yellow-950 border-2 border-yellow-600 hover:bg-yellow-900 hover:border-yellow-400 rounded text-xs font-bold text-yellow-300 transition"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ability Selection for Current Category */}
              {skillEditState && (
                <div>
                  <h3 className="text-lg font-bold text-yellow-300 mb-3">
                    Select Ability in {editTemplate?.players[skillEditState.playerId]?.skills[skillEditState.skillIndex]?.category || 'Category'}
                  </h3>
                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto">
                    {abilityCategories[editTemplate?.players[skillEditState.playerId]?.skills[skillEditState.skillIndex]?.category as AbilityCategory || 'dragonknight'].map((ability) => {
                      const category = editTemplate?.players[skillEditState.playerId]?.skills[skillEditState.skillIndex]?.category as AbilityCategory;
                      const imagePath = getAbilityImagePath(category, ability);
                      return (
                        <button
                          key={ability}
                          onClick={() => {
                            const data = editTemplate?.players[skillEditState.playerId];
                            data.skills[skillEditState.skillIndex].ability = ability;
                            setEditTemplate({ ...editData, [skillEditState.playerId]: data });
                            setSkillEditState(null);
                          }}
                          className="relative group flex flex-col items-center gap-1"
                          title={ability}
                        >
                          <div className="w-12 h-12 bg-yellow-950 rounded border-2 border-yellow-600 hover:border-yellow-400 transition flex items-center justify-center p-1">
                            <Image
                              src={imagePath}
                              alt={ability}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover"
                              onError={(e) => {
                                // Fallback if image doesn't load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            {ability}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setSkillEditState(null)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

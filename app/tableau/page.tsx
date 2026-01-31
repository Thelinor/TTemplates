'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRaid } from '@/app/RaidContext';
import BurgerMenu from '@/components/BurgerMenu';
import { DEFAULT_FOOD_ICON, DEFAULT_POTION_ICON, FOOD_ICON_MAP, POTION_ICON_MAP, ROLE_ICON_MAP } from '@/lib/iconMaps';
import { getRaidBackground, getRaidDisplayName } from '@/lib/raidDisplay';
import { downloadTemplateAsJson, triggerJsonImport } from '@/lib/templateIO';
import {
  AbilityCategory,
  abilityCategories,
  getAbilityImagePath,
  getAllAbilityCategories,
} from '@/lib/abilityCategories';

const ESO_SETS = [
  'Powerfull Assault',
  'SPC',
  'RO',
  'Jorvuld',
  'Null Arca',
  'Relequen',
  'Slimecraw',
  'Pearlescent',
  'Saxheel',
  'Lucent Echos',
  'Deadly Strike',
  'Aegis Caller',
  'Maestrom inferno staff',
  'Black Rose Prison Bow',
];

const FOOD_OPTIONS = ['', 'Bastion', 'Tripe', 'Mushroom', 'Grapes', 'Lobster', 'Rice'];
const POTION_OPTIONS = ['', 'Spell Power', 'Stamina', 'Health', 'Magicka', 'Tri-Stat'];

const MAIN_BAR_SLOTS = ['MainBar1', 'MainBar2', 'MainBar3', 'MainBar4', 'MainBar5'] as const;
const BACK_BAR_SLOTS = ['BackBar1', 'BackBar2', 'BackBar3', 'BackBar4', 'BackBar5'] as const;

type SkillEditorState = { playerId: number; field: string };
type SetEditorState = { playerId: number; slot: string };
type ConsumableEditorState = { playerId: number; type: 'food' | 'potion' };

function findAbilityCategory(abilityName: string): AbilityCategory | null {
  if (!abilityName) return null;

  for (const category of getAllAbilityCategories()) {
    if (abilityCategories[category].includes(abilityName)) {
      return category;
    }
  }

  return null;
}

export default function TableauView() {
  const { template, players, exportTemplate, loadTemplate, updateFightPlayerStuff, addFight, removeFight } = useRaid();
  const [selectedFightName, setSelectedFightName] = useState(template.fights[0]?.name ?? '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [skillEditor, setSkillEditor] = useState<SkillEditorState | null>(null);
  const [setEditor, setSetEditor] = useState<SetEditorState | null>(null);
  const [consumableEditor, setConsumableEditor] = useState<ConsumableEditorState | null>(null);
  const [currentAbilityCategory, setCurrentAbilityCategory] = useState<AbilityCategory>('dragonknight');

  useEffect(() => {
    if (!template.fights.some((fight) => fight.name === selectedFightName)) {
      setSelectedFightName(template.fights[0]?.name ?? '');
    }
  }, [selectedFightName, template.fights]);

  const raidBackground = getRaidBackground(template.raid.selectedRaid);
  const fight = template.fights.find((entry) => entry.name === selectedFightName) ?? template.fights[0];

  const activeSkillCategory = useMemo(() => {
    if (!skillEditor) return currentAbilityCategory;

    const playerStuff = fight.playersStuff.find((entry) => entry.id === skillEditor.playerId);
    const currentValue = playerStuff?.competencies[skillEditor.field as keyof typeof playerStuff.competencies] ?? '';

    return findAbilityCategory(currentValue) ?? currentAbilityCategory;
  }, [currentAbilityCategory, fight.playersStuff, skillEditor]);

  if (!fight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8 flex items-center justify-center text-yellow-200">
        Aucun tableau disponible.
      </div>
    );
  }

  const handleExportJson = () => {
    const json = exportTemplate();
    downloadTemplateAsJson(json);
  };

  const handleImportJson = () => {
    triggerJsonImport((text) => {
      loadTemplate(text);
    });
  };

  const handleAddFight = () => {
    const nextName = addFight();
    setSelectedFightName(nextName);
  };

  const handleRemoveFight = () => {
    const nextName = removeFight(fight.name);
    if (nextName) {
      setSelectedFightName(nextName);
    }
  };

  const renderAbilityButton = (playerId: number, field: string, value: string) => {
    const category = findAbilityCategory(value) ?? activeSkillCategory;
    const hasValue = Boolean(value);

    return (
      <button
        type="button"
        onClick={() => {
          if (hasValue && category) {
            setCurrentAbilityCategory(category);
          } else {
            setCurrentAbilityCategory(activeSkillCategory);
          }
          setSkillEditor({ playerId, field });
        }}
        className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 bg-black/60 p-0.5 transition hover:border-yellow-400 ${
          hasValue ? 'border-yellow-600' : 'border-dashed border-yellow-700'
        }`}
      >
        {hasValue && category ? (
          <Image src={getAbilityImagePath(category, value)} alt="" width={40} height={40} className="h-full w-full object-cover" />
        ) : null}
      </button>
    );
  };

  const renderViewAbilityIcon = (value: string, category?: AbilityCategory) => {
    if (!value || !category) {
      return <div className="h-12 w-12 shrink-0 border border-dashed border-yellow-700 bg-black/40" />;
    }

    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-yellow-600 bg-black/40 p-0.5">
        <Image src={getAbilityImagePath(category, value)} alt="" width={40} height={40} className="h-full w-full object-cover" />
      </div>
    );
  };

  const renderConsumableSlot = (
    playerId: number,
    type: 'food' | 'potion',
    value: string,
  ) => {
    const iconMap = type === 'food' ? FOOD_ICON_MAP : POTION_ICON_MAP;
    const defaultIcon = type === 'food' ? DEFAULT_FOOD_ICON : DEFAULT_POTION_ICON;
    const iconSrc = value ? iconMap[value] ?? defaultIcon : null;

    if (isEditMode) {
      return (
        <button
          type="button"
          onClick={() => setConsumableEditor({ playerId, type })}
          className={`flex h-12 w-12 shrink-0 items-center justify-center self-center border-2 bg-black/60 p-0.5 transition hover:border-yellow-400 ${
            value ? 'border-yellow-600' : 'border-dashed border-yellow-700'
          }`}
        >
          {iconSrc ? (
            <Image src={iconSrc} alt="" width={40} height={40} className="h-full w-full object-cover" />
          ) : null}
        </button>
      );
    }

    if (!iconSrc) {
      return <div className="h-12 w-12 shrink-0 self-center border border-dashed border-yellow-700 bg-black/40" />;
    }

    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center self-center border-2 border-yellow-600 bg-black/40 p-0.5">
        <Image src={iconSrc} alt="" width={40} height={40} className="h-full w-full object-cover" />
      </div>
    );
  };

  const renderActionBar = (
    playerId: number,
    competencies: typeof fight.playersStuff[number]['competencies'],
    food: string,
    potion: string,
  ) => {
    const renderSlot = (field: string, value: string) => {
      const abilityCategory = findAbilityCategory(value) ?? undefined;

      return (
        <div key={`${playerId}-${field}`}>
          {isEditMode ? renderAbilityButton(playerId, field, value) : renderViewAbilityIcon(value, abilityCategory)}
        </div>
      );
    };

    return (
      <div className="inline-flex items-center gap-2">
        {/* Potion: fixed on the left, without any visible text. */}
        {renderConsumableSlot(playerId, 'potion', potion)}

        {/* Two action bars: 5 abilities + 1 dedicated ultimate each. */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {MAIN_BAR_SLOTS.map((slot) => renderSlot(slot, competencies[slot]))}
            {renderSlot('MainBarUlt', competencies.MainBarUlt)}
          </div>

          <div className="flex items-center gap-1">
            {BACK_BAR_SLOTS.map((slot) => renderSlot(slot, competencies[slot]))}
            {renderSlot('BackBarUlt', competencies.BackBarUlt)}
          </div>
        </div>

        {/* Food: fixed on the right, without any visible text. */}
        {renderConsumableSlot(playerId, 'food', food)}
      </div>
    );
  };

  const renderViewSetBadge = (value: string) => {
    if (!value) {
      return <div className="flex h-8 min-w-[3.5rem] items-center justify-center rounded border border-dashed border-yellow-700 bg-yellow-950 px-2 text-[9px] text-yellow-500">—</div>;
    }

    const shortName = value.length > 12 ? `${value.slice(0, 12)}…` : value;

    return (
      <div title={value} className="flex h-8 min-w-[3.5rem] items-center justify-center rounded border border-yellow-600 bg-yellow-950 px-2 text-[9px] font-medium text-yellow-100">
        {shortName}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-8"
      style={{
        backgroundImage: raidBackground ? `url(${raidBackground})` : 'linear-gradient(to bottom right, #111827, #78350f, #111827)',
      }}
    >
      <div className="fixed inset-0 bg-black/60 -z-10" />

      <div className="max-w-[96rem] mx-auto relative z-10">
        <div className="flex justify-end mb-4">
          <BurgerMenu onExport={handleExportJson} onImport={handleImportJson} />
        </div>

        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">{getRaidDisplayName(template.raid.selectedRaid, template.raid.groupName)}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsEditMode((current) => !current)}
              className={`px-4 py-2 font-bold rounded-lg transition ${
                isEditMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isEditMode ? '✓ Aperçu' : '✎ Éditer'}
            </button>
            <button
              type="button"
              onClick={handleAddFight}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition"
            >
              + Nouveau tableau
            </button>
            {template.fights.length > 1 && (
              <button
                type="button"
                onClick={handleRemoveFight}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition"
              >
                Supprimer le tableau
              </button>
            )}
            <Link href="/raid-setup" className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition">← Retour</Link>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {template.fights.map((entry) => (
            <button
              key={entry.name}
              type="button"
              onClick={() => setSelectedFightName(entry.name)}
              className={`px-3 py-2 rounded-lg border font-bold transition ${
                entry.name === fight.name
                  ? 'bg-yellow-600 border-yellow-400 text-white'
                  : 'bg-yellow-950 border-yellow-600 text-yellow-200 hover:border-yellow-400'
              }`}
            >
              {entry.name}
            </button>
          ))}
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-8" />

        <div className="overflow-x-auto bg-amber-950 border-2 border-yellow-600 rounded-lg shadow-2xl">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-yellow-600 bg-gradient-to-r from-amber-900 to-yellow-900">
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Nom</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Rôle</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Classes</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Sets</th>
                <th className="px-4 py-3 text-left text-yellow-300 font-bold">Build</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const playerStuff = fight.playersStuff.find((entry) => entry.id === player.id) ?? {
                  id: player.id,
                  name: player.name,
                  role: player.role,
                  sets: {
                    head: '',
                    chest: '',
                    waist: '',
                    boots: '',
                    shoulders: '',
                    gloves: '',
                    legs: '',
                    ring1: '',
                    ring2: '',
                    necklace: '',
                    mainBarWeapon1: '',
                    mainBarWeapon2: '',
                    backBarWeapon1: '',
                    backBarWeapon2: '',
                  },
                  competencies: {
                    MainBar1: '',
                    MainBar2: '',
                    MainBar3: '',
                    MainBar4: '',
                    MainBar5: '',
                    MainBarUlt: '',
                    BackBar1: '',
                    BackBar2: '',
                    BackBar3: '',
                    BackBar4: '',
                    BackBar5: '',
                    BackBarUlt: '',
                  },
                  food: '',
                  potion: '',
                };

                return (
                  <tr key={player.id} className="border-b border-yellow-700 align-top">
                    <td className="px-4 py-6 text-yellow-100 font-semibold">{player.name}</td>
                    <td className="px-4 py-6">
                      <div className="relative group inline-block">
                        <Image src={ROLE_ICON_MAP[player.role] || ''} alt={player.role} width={40} height={40} className="w-10 h-10" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                          {player.role}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-wrap gap-2">
                        {[player.skillClasses.MainSkillClass, player.skillClasses.SecondSkillClass, player.skillClasses.ThirdSkillClass]
                          .filter(Boolean)
                          .map((cls) => (
                            <span key={`${player.id}-${cls}`} className="bg-yellow-950 px-2 py-1 rounded border border-yellow-600 text-xs text-yellow-100">
                              {cls}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-6 text-sm text-yellow-100 align-top">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(playerStuff.sets).map(([key, value]) => (
                          <div key={`${player.id}-set-${key}`} className="flex items-center gap-2">
                            <label className="w-14 text-[10px] uppercase tracking-wide text-yellow-300">{key}</label>
                            {isEditMode ? (
                              <button
                                type="button"
                                onClick={() => setSetEditor({ playerId: player.id, slot: key })}
                                className={`min-w-[3.5rem] rounded border px-2 py-1 text-left text-[9px] ${
                                  value ? 'border-yellow-500 bg-yellow-950 text-yellow-100' : 'border-dashed border-yellow-600 bg-yellow-950 text-yellow-300'
                                }`}
                              >
                                {value || 'Choisir'}
                              </button>
                            ) : (
                              renderViewSetBadge(value)
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-6 align-top text-sm text-yellow-100">
                      {renderActionBar(player.id, playerStuff.competencies, playerStuff.food, playerStuff.potion)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {skillEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-amber-900 to-yellow-900 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-yellow-400">Sélectionner une ability</h2>
              <button type="button" onClick={() => setSkillEditor(null)} className="text-2xl text-yellow-400 hover:text-yellow-300">×</button>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-bold text-yellow-300">Catégorie</h3>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
                {getAllAbilityCategories().map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCurrentAbilityCategory(category)}
                    className={`rounded border px-3 py-2 text-xs font-bold uppercase ${
                      category === activeSkillCategory
                        ? 'border-yellow-400 bg-yellow-600 text-white'
                        : 'border-yellow-600 bg-yellow-950 text-yellow-200 hover:border-yellow-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-yellow-300">Ability</h3>
              <div className="grid max-h-[52vh] grid-cols-6 gap-3 overflow-y-auto md:grid-cols-8 lg:grid-cols-10">
                {abilityCategories[activeSkillCategory].map((ability) => (
                  <button
                    key={ability}
                    type="button"
                    onClick={() => {
                      updateFightPlayerStuff(fight.name, skillEditor.playerId, skillEditor.field, ability);
                      setSkillEditor(null);
                    }}
                    className="group relative flex flex-col items-center gap-1 rounded border border-yellow-600 bg-yellow-950 p-2 transition hover:border-yellow-400"
                    title={ability}
                  >
                    <div className="flex h-12 w-12 items-center justify-center">
                      <Image src={getAbilityImagePath(activeSkillCategory, ability)} alt={ability} width={40} height={40} className="h-10 w-10 object-cover" />
                    </div>
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-yellow-100 opacity-0 transition group-hover:opacity-100">
                      {ability}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {consumableEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-amber-900 to-yellow-900 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-yellow-400">
                {consumableEditor.type === 'food' ? 'Choisir une nourriture' : 'Choisir une potion'}
              </h2>
              <button type="button" onClick={() => setConsumableEditor(null)} className="text-2xl text-yellow-400 hover:text-yellow-300">×</button>
            </div>

            <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
              {(consumableEditor.type === 'food' ? FOOD_OPTIONS : POTION_OPTIONS).map((option) => {
                const iconMap = consumableEditor.type === 'food' ? FOOD_ICON_MAP : POTION_ICON_MAP;
                const defaultIcon = consumableEditor.type === 'food' ? DEFAULT_FOOD_ICON : DEFAULT_POTION_ICON;
                const iconSrc = option ? iconMap[option] ?? defaultIcon : null;

                return (
                  <button
                    key={option || 'empty-consumable'}
                    type="button"
                    onClick={() => {
                      updateFightPlayerStuff(fight.name, consumableEditor.playerId, consumableEditor.type, option);
                      setConsumableEditor(null);
                    }}
                    className={`flex h-14 w-14 items-center justify-center border-2 bg-black/40 p-1 transition hover:border-yellow-400 ${
                      option ? 'border-yellow-600' : 'border-dashed border-yellow-700'
                    }`}
                    title={option || 'Aucune'}
                  >
                    {iconSrc ? (
                      <Image src={iconSrc} alt="" width={48} height={48} className="h-full w-full object-cover" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {setEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-yellow-600 bg-gradient-to-b from-amber-900 to-yellow-900 p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-yellow-400">Choisir un set</h2>
              <button type="button" onClick={() => setSetEditor(null)} className="text-2xl text-yellow-400 hover:text-yellow-300">×</button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {ESO_SETS.map((setName) => (
                <button
                  key={setName}
                  type="button"
                  onClick={() => {
                    updateFightPlayerStuff(fight.name, setEditor.playerId, setEditor.slot, setName);
                    setSetEditor(null);
                  }}
                  className="rounded border border-yellow-600 bg-yellow-950 px-3 py-2 text-left text-sm text-yellow-100 transition hover:border-yellow-400 hover:bg-yellow-900"
                >
                  {setName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

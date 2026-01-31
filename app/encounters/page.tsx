'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRaid } from '@/app/RaidContext';
import BurgerMenu from '@/components/BurgerMenu';
import { DEFAULT_FOOD_ICON, DEFAULT_POTION_ICON, FOOD_ICON_MAP, POTION_ICON_MAP, MUNDUS_ICON_MAP, ROLE_ICON_MAP, SKILL_LINE_ICON_MAP } from '@/lib/iconMaps';
import { ESO_FOODS } from '@/lib/esoFoods';
import { ESO_POTIONS } from '@/lib/esoPotions';
import { getRaidBackground, getRaidDisplayName } from '@/lib/raidDisplay';
import { downloadTemplateAsJson, triggerJsonImport } from '@/lib/templateFileIO';
import {
  AbilityCategory,
  abilityCategories,
  getAbilityImagePath,
  getAllAbilityCategories,
  getAbilityCategoriesForSkillLines,
  getAbilitySkillTree,
} from '@/lib/abilityCategories';
import { ESO_SETS } from '@/lib/esoSets';
import { ESO_TRAITS } from '@/lib/esoTraits';
import { ESO_ENCHANTS } from '@/lib/esoEnchants';
import {
  ArmorWeight,
  ChampionPointDiscipline,
  ChampionPointsByDiscipline,
  ClassSkillLine,
  createEmptyGearPiece,
  GearType,
  getChampionPointDisciplineFromSlot,
  copyFightPlayerSetup,
  createEmptySetSlots,
  type ChampionPointName,
  type FightPlayerSetup,
  type GearPiece,
} from '@/lib/raidTemplate';
import { GearIcon } from '@/lib/gearIcons';

const MAIN_BAR_SLOTS = ['MainBar1', 'MainBar2', 'MainBar3', 'MainBar4', 'MainBar5'] as const;
const BACK_BAR_SLOTS = ['BackBar1', 'BackBar2', 'BackBar3', 'BackBar4', 'BackBar5'] as const;
const CHAMPION_POINT_SLOTS = [
  'Blue1', 'Blue2', 'Blue3', 'Blue4',
  'Red1', 'Red2', 'Red3', 'Red4',
  'Green1', 'Green2', 'Green3', 'Green4',
] as const;

// Placeholder images for set slots.
const SET_SLOT_PLACEHOLDER_IMAGES: Record<string, string> = Object.fromEntries(
  [
    'head',
    'shoulders',
    'chest',
    'gloves',
    'waist',
    'legs',
    'boots',
    'necklace',
    'ring1',
    'ring2',
    'mainBarWeapon1',
    'mainBarWeapon2',
    'backBarWeapon1',
    'backBarWeapon2',
  ].map((slot) => [slot, '/empty-set-slot.svg'] as const),
);

const SET_LAYOUT_ROWS = [
  [{ slot: 'head', label: 'Head', colSpan: 2 }],
  [
    { slot: 'shoulders', label: 'Shoulder' },
    { slot: 'chest', label: 'Chest' },
  ],
  [
    { slot: 'gloves', label: 'Arm' },
    { slot: 'waist', label: 'Waist' },
  ],
  [
    { slot: 'legs', label: 'Legs' },
    { slot: 'boots', label: 'Boots' },
  ],
] as const;

type SkillEditorState = { playerId: number; field: string; ultimateOnly: boolean };
type SetEditorState = { playerId: number; slot: string };
type ConsumableEditorState = { playerId: number; type: 'food' | 'potion' };
type ChampionPointEditorState = { playerId: number; field: string };
type CopiedSetupState = {
  fightName: string;
  playerId: number;
  playerName: string;
  setup: FightPlayerSetup;
};

const CHAMPION_CATEGORY_STYLE: Record<ChampionPointDiscipline, string> = {
  [ChampionPointDiscipline.TheMage]: 'border-blue-500 text-blue-100 bg-blue-950/60',
  [ChampionPointDiscipline.TheWarrior]: 'border-red-500 text-red-100 bg-red-950/60',
  [ChampionPointDiscipline.TheThief]: 'border-green-500 text-green-100 bg-green-950/60',
};

const CHAMPION_CATEGORY_FRAME: Record<ChampionPointDiscipline, string> = {
  [ChampionPointDiscipline.TheMage]: 'border-blue-500/80',
  [ChampionPointDiscipline.TheWarrior]: 'border-red-500/80',
  [ChampionPointDiscipline.TheThief]: 'border-green-500/80',
};

const CHAMPION_DISCIPLINE_LABELS: Record<ChampionPointDiscipline, string> = {
  [ChampionPointDiscipline.TheMage]: 'The Mage',
  [ChampionPointDiscipline.TheWarrior]: 'The Warrior',
  [ChampionPointDiscipline.TheThief]: 'The Thief',
};

function findAbilityCategory(abilityName: string): AbilityCategory | null {
  if (!abilityName) return null;

  for (const category of getAllAbilityCategories()) {
    if (abilityCategories[category].includes(abilityName)) {
      return category;
    }
  }

  return null;
}

const classSkillLines: Record<string, string[]> = {
  Templar: ['Aedric Spear', "Dawn's Wrath", 'Restoring Light'],
  Sorcerer: ['Daedric Summoning', 'Dark Magic', 'Storm Calling'],
  Nightblade: ['Assassination', 'Shadowy Embrace', 'Siphoning'],
  Dragonknight: ['Earthen Heart', 'Draconic Power', 'Ardent Flame'],
  Warden: ['Green Balance', "Winter's Embrace", 'Animal Companions'],
  Necromancer: ['Grave Lord', 'Living Death', 'Bone Tyrant'],
  Arcanist: ['Curative Runeforms', 'Herald of the Tomes', 'Soldier of Apocrypha'],
};

function getClassForSkillLine(skillLine: string): string | null {
  return Object.entries(classSkillLines).find(([, lines]) => lines.includes(skillLine))?.[0] ?? null;
}

function getSetSummary(sets: Record<string, GearPiece | string>): Array<[string, number]> {
  const counts = new Map<string, number>();

  Object.values(sets).forEach((gear) => {
    const setName = typeof gear === 'string' ? gear : gear.setName;
    if (!setName) return;

    counts.set(setName, (counts.get(setName) ?? 0) + 1);
  });

  return Array.from(counts.entries());
}

export default function EncountersPage() {
  const { template, players, loadTemplate, updateFightPlayerStuff, pasteFightPlayerSetup, addFight, removeFight } = useRaid();
  const [selectedFightName, setSelectedFightName] = useState(template.fights[0]?.name ?? '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [skillEditor, setSkillEditor] = useState<SkillEditorState | null>(null);
  const [setEditor, setSetEditor] = useState<SetEditorState | null>(null);
  const [gearDraft, setGearDraft] = useState<GearPiece | null>(null);
  const [setSearch, setSetSearch] = useState('');
  const [foodSearch, setFoodSearch] = useState('');
  const [potionSearch, setPotionSearch] = useState('');
  const [consumableEditor, setConsumableEditor] = useState<ConsumableEditorState | null>(null);
  const [championPointEditor, setChampionPointEditor] = useState<ChampionPointEditorState | null>(null);
  const [currentAbilityCategory, setCurrentAbilityCategory] = useState<AbilityCategory>(ClassSkillLine.EarthenHeart);
  const [showSetDetailsByPlayer, setShowSetDetailsByPlayer] = useState<Record<number, boolean>>({});
  const [copiedSetup, setCopiedSetup] = useState<CopiedSetupState | null>(null);

  const raidBackground = getRaidBackground(template.raid.selectedRaid);
  const activeFightName = template.fights.some((entry) => entry.name === selectedFightName)
    ? selectedFightName
    : template.fights[0]?.name ?? '';
  const fight = template.fights.find((entry) => entry.name === activeFightName) ?? template.fights[0];

  const editingPlayer = skillEditor
    ? players.find((player) => player.id === skillEditor.playerId)
    : undefined;
  const availableSkillCategories = editingPlayer
    ? getAbilityCategoriesForSkillLines([
      editingPlayer.skillClasses.MainSkillClass,
      editingPlayer.skillClasses.SecondSkillClass,
      editingPlayer.skillClasses.ThirdSkillClass,
    ])
    : getAllAbilityCategories();
  const activeSkillCategory = availableSkillCategories.includes(currentAbilityCategory)
    ? currentAbilityCategory
    : availableSkillCategories[0] ?? ClassSkillLine.EarthenHeart;
  const filteredSets = ESO_SETS.filter((set) => set.setName.toLowerCase().includes(setSearch.trim().toLowerCase()));
  const filteredFoods = ESO_FOODS.filter((food) => food.name.toLowerCase().includes(foodSearch.trim().toLowerCase()));
  const filteredPotions = ESO_POTIONS.filter((potion) => potion.name.toLowerCase().includes(potionSearch.trim().toLowerCase()));
  const availableTraits = gearDraft
    ? ESO_TRAITS.filter((trait) => trait.gearType === gearDraft.type)
    : [];
  const availableEnchants = gearDraft
    ? ESO_ENCHANTS.filter((enchant) => enchant.gearType === gearDraft.type)
    : [];

  if (!fight) {
    return (
      <div className="min-h-screen bg-[#050506] p-8 flex items-center justify-center text-white">
        No encounter table available.
      </div>
    );
  }

  const handleExportJson = () => {
    downloadTemplateAsJson(template);
  };

  const handleImportJson = () => {
    triggerJsonImport((text) => {
      loadTemplate(text);
    });
  };

  const handleAddFight = () => {
    const proposedName = window.prompt('Name this encounter table', 'New Encounter');
    if (proposedName === null) {
      return;
    }

    const nextName = addFight(proposedName.trim() || 'New Encounter');
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
          const availableCategories = editingPlayer
            ? getAbilityCategoriesForSkillLines([
              editingPlayer.skillClasses.MainSkillClass,
              editingPlayer.skillClasses.SecondSkillClass,
              editingPlayer.skillClasses.ThirdSkillClass,
            ])
            : getAllAbilityCategories();
          const selectedCategory = hasValue && category && availableCategories.includes(category)
            ? category
            : availableCategories.includes(activeSkillCategory)
              ? activeSkillCategory
              : availableCategories[0];

          if (selectedCategory) setCurrentAbilityCategory(selectedCategory);
          setSkillEditor({ playerId, field, ultimateOnly: field === 'MainBarUlt' || field === 'BackBarUlt' });
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
      <div className="flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-yellow-300">
              Potion
            </span>
            {renderConsumableSlot(playerId, 'potion', potion)}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              {MAIN_BAR_SLOTS.map((slot) => renderSlot(slot, competencies[slot]))}
              <div className="ml-10">
                {renderSlot('MainBarUlt', competencies.MainBarUlt)}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {BACK_BAR_SLOTS.map((slot) => renderSlot(slot, competencies[slot]))}
              <div className="ml-10">
                {renderSlot('BackBarUlt', competencies.BackBarUlt)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-wide text-yellow-300">
            Food
          </span>
          {renderConsumableSlot(playerId, 'food', food)}
        </div>
      </div>
    );
  };

  const renderChampionPointSlot = (playerId: number, field: string, value: ChampionPointName | '') => {
    const normalizedValue = value || '–';
    const colorClass = field.startsWith('Blue')
      ? 'border-blue-500 text-blue-100 bg-blue-950/60'
      : field.startsWith('Red')
        ? 'border-red-500 text-red-100 bg-red-950/60'
        : 'border-green-500 text-green-100 bg-green-950/60';

    if (isEditMode) {
      return (
        <button
          key={`${playerId}-${field}`}
          type="button"
          onClick={() => setChampionPointEditor({ playerId, field })}
          className={`flex h-8 min-w-16 items-center justify-center rounded border px-2 text-[11px] font-bold transition hover:border-yellow-300 ${
            value ? colorClass : 'border-dashed border-yellow-700 bg-black/40 text-yellow-400'
          }`}
          title={value || 'Choose a champion point'}
        >
          {normalizedValue}
        </button>
      );
    }

    return (
      <div
        key={`${playerId}-${field}`}
        className={`flex h-8 min-w-16 items-center justify-center rounded border px-2 text-[11px] font-bold ${
          value ? colorClass : 'border-dashed border-yellow-700 bg-black/40 text-yellow-400'
        }`}
        title={value || 'No champion point'}
      >
        {normalizedValue}
      </div>
    );
  };

  const renderChampionPoints = (
    playerId: number,
    championPoints: typeof fight.playersStuff[number]['championPoints'],
  ) => {
    const categoryGroups = [
      {
        discipline: ChampionPointDiscipline.TheMage,
        slots: CHAMPION_POINT_SLOTS.filter((slot) => slot.startsWith('Blue')),
        label: CHAMPION_DISCIPLINE_LABELS[ChampionPointDiscipline.TheMage],
      },
      {
        discipline: ChampionPointDiscipline.TheWarrior,
        slots: CHAMPION_POINT_SLOTS.filter((slot) => slot.startsWith('Red')),
        label: CHAMPION_DISCIPLINE_LABELS[ChampionPointDiscipline.TheWarrior],
      },
      {
        discipline: ChampionPointDiscipline.TheThief,
        slots: CHAMPION_POINT_SLOTS.filter((slot) => slot.startsWith('Green')),
        label: CHAMPION_DISCIPLINE_LABELS[ChampionPointDiscipline.TheThief],
      },
    ];

    const topGroups = categoryGroups.filter((group) => group.discipline !== ChampionPointDiscipline.TheThief);
    const thiefGroup = categoryGroups.find((group) => group.discipline === ChampionPointDiscipline.TheThief);

    // Preview is intentionally compact: show the selected CP names per discipline,
    // while retaining the slot-by-slot 2×2 picker in edit mode.
    if (!isEditMode) {
      const renderChampionPointSummary = (group: typeof categoryGroups[number]) => {
        const selectedPoints = group.slots
          .map((slot) => championPoints[slot])
          .filter((point): point is ChampionPointName => Boolean(point));

        return (
          <div key={group.discipline} className={`shrink-0 rounded-lg border px-2 py-1 ${CHAMPION_CATEGORY_FRAME[group.discipline]}`}>
            <div className={`inline-flex rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${CHAMPION_CATEGORY_STYLE[group.discipline]}`}>{group.label}</div>
            <ul className="mt-1 min-w-32 space-y-0.5 text-center text-[11px] font-bold text-yellow-100">
              {selectedPoints.length > 0 ? (
                selectedPoints.map((point) => <li key={point}>{point}</li>)
              ) : (
                <li className="text-yellow-200">No champion points selected</li>
              )}
            </ul>
          </div>
        );
      };

      return (
        <div className="flex flex-col items-center gap-2 overflow-x-auto">
          <div className="flex flex-nowrap items-start justify-center gap-2">
            {topGroups.map(renderChampionPointSummary)}
          </div>

          {thiefGroup && (
            <div className="flex w-full justify-center">
              {renderChampionPointSummary(thiefGroup)}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-2 overflow-x-auto">
        <div className="flex flex-nowrap items-center justify-center gap-2">
          {topGroups.map((group) => (
            <div key={group.discipline} className={`shrink-0 rounded-lg border px-2 py-1 ${CHAMPION_CATEGORY_FRAME[group.discipline]}`}>
              <div className={`inline-flex rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${CHAMPION_CATEGORY_STYLE[group.discipline]}`}>{group.label}</div>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {group.slots.map((slot) => renderChampionPointSlot(playerId, slot, championPoints[slot]))}
              </div>
            </div>
          ))}
        </div>

        {thiefGroup && (
          <div className="flex w-full justify-center">
            <div className={`shrink-0 rounded-lg border px-2 py-1 ${CHAMPION_CATEGORY_FRAME[thiefGroup.discipline]}`}>
              <div className={`inline-flex rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${CHAMPION_CATEGORY_STYLE[thiefGroup.discipline]}`}>{thiefGroup.label}</div>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {thiefGroup.slots.map((slot) => renderChampionPointSlot(playerId, slot, championPoints[slot]))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSetSlot = (playerId: number, slot: string, label: string) => {
    const playerStuff = fight.playersStuff.find((entry) => entry.id === playerId);
    const gear = playerStuff?.sets[slot as keyof typeof playerStuff.sets];
    const value = gear?.setName ?? '';
    const placeholderImage = SET_SLOT_PLACEHOLDER_IMAGES[slot];

    return (
      <div className="flex min-w-0 flex-col items-center gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-yellow-300">
          {label}
        </span>
        {isEditMode ? (
          <button
            type="button"
            onClick={() => {
              const type = slot.includes('Weapon') ? GearType.weapon : slot.includes('ring') || slot === 'necklace' ? GearType.jewelry : GearType.armor;
              setGearDraft(gear ?? createEmptyGearPiece(type));
              setSetEditor({ playerId, slot });
            }}
            title={value || `Choose ${label}`}
            className={`group relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border-2 bg-black/60 p-0.5 transition hover:border-yellow-400 ${
              value ? 'border-yellow-600' : 'border-dashed border-yellow-700'
            }`}
          >
            <GearIcon key={`${value}-${gear?.armorWeight ?? 'none'}-${gear?.weaponType ?? 'none'}`} gear={gear} slot={slot} fallbackSrc={placeholderImage} alt={value} className="h-full w-full object-cover opacity-90" />
            {!value && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-sm text-yellow-300">
                +
              </span>
            )}
          </button>
        ) : (
          <div
            title={value || `No ${label}`}
            className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border-2 bg-black/60 p-0.5 ${
              value ? 'border-yellow-600' : 'border-dashed border-yellow-700'
            }`}
          >
            <GearIcon key={`${value}-${gear?.armorWeight ?? 'none'}-${gear?.weaponType ?? 'none'}`} gear={gear} slot={slot} fallbackSrc={placeholderImage} alt={value} className={`h-full w-full object-cover ${value ? 'opacity-100' : 'opacity-40'}`} />
          </div>
        )}
        <span
          title={value || 'No set selected'}
          className="max-w-16 truncate text-[8px] text-yellow-100"
        >
          {value || ''}
        </span>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed p-8"
      style={{
        backgroundImage: raidBackground ? `url(${raidBackground})` : 'linear-gradient(to bottom right, #050506, #111111, #050506)',
      }}
    >
      <div className="fixed inset-0 bg-black/75 -z-10" />

      <div className="max-w-[96rem] mx-auto relative z-10">
        <div className="flex justify-end mb-4">
          <BurgerMenu onExport={handleExportJson} onImport={handleImportJson} />
        </div>

        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <h1 className="text-4xl font-bold text-[#f8f7f2] drop-shadow-lg">{getRaidDisplayName(template.raid.selectedRaid, template.raid.groupName)}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsEditMode((current) => !current)}
              className={`px-4 py-2 font-bold rounded-lg transition ${
                isEditMode ? 'bg-[#d6b46b] hover:bg-[#f7e7ba] text-black' : 'bg-[#1c1c1f] hover:bg-[#333] text-white border border-[#d6b46b]'
              }`}
            >
              {isEditMode ? '✓ Preview' : '✎ Edit'}
            </button>
            <button
              type="button"
              onClick={handleAddFight}
              className="px-4 py-2 bg-[#1b1b1b] hover:bg-[#30302f] text-white font-bold rounded-lg transition border border-[#d6b46b]"
            >
              + New Encounter
            </button>
            {template.fights.length > 1 && (
              <button
                type="button"
                onClick={handleRemoveFight}
                className="px-4 py-2 bg-[#2e1717] hover:bg-[#582020] text-white font-bold rounded-lg transition border border-[#b76b6b]"
              >
                Delete Encounter
              </button>
            )}
            <Link href="/players" className="px-6 py-3 bg-[#d6b46b] hover:bg-[#f7e7ba] text-black font-bold rounded-lg transition">← Back</Link>
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
                  ? 'bg-[#d6b46b] border-[#f8f7f2] text-black'
                  : 'bg-[#141414] border-[#d6b46b] text-white hover:border-[#f8f7f2]'
              }`}
            >
              {entry.name}
            </button>
          ))}
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-[#d6b46b] to-transparent mb-8" />

        {isEditMode && copiedSetup?.fightName === fight.name && (
          <div className="mb-4 rounded-lg border border-[#d6b46b] bg-black/65 px-4 py-2 text-sm text-yellow-100">
            Setup copied from <span className="font-bold text-[#f7e7ba]">{copiedSetup.playerName}</span>. Choose Paste on another player to apply it.
          </div>
        )}

        <div className="overflow-x-auto bg-[#111111] border-2 border-[#d6b46b] rounded-lg shadow-2xl">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#d6b46b] bg-[#191919]">
                <th className="px-4 py-3 text-center text-[#f8f7f2] font-bold">Player</th>
                <th className="px-4 py-3 text-center text-[#f8f7f2] font-bold">Sets</th>
                <th className="px-4 py-3 text-center text-[#f8f7f2] font-bold">Skills</th>
                <th className="px-4 py-3 text-center text-[#f8f7f2] font-bold">Champion Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const playerStuff = fight.playersStuff.find((entry) => entry.id === player.id) ?? {
                  id: player.id,
                  name: player.name,
                  role: player.role,
                  sets: createEmptySetSlots(),
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
                  championPoints: {
                    Blue1: '',
                    Blue2: '',
                    Blue3: '',
                    Blue4: '',
                    Red1: '',
                    Red2: '',
                    Red3: '',
                    Red4: '',
                    Green1: '',
                    Green2: '',
                    Green3: '',
                    Green4: '',
                  },
                  food: '',
                  potion: '',
                };
                const setSummary = getSetSummary(playerStuff.sets);

                return (
                  <tr key={player.id} className="border-b border-yellow-700 align-top">
                    <td className="px-4 py-6 text-yellow-100 font-semibold">
                      <div className="flex flex-col items-center gap-2">
                        <span>{player.name}</span>

                        {isEditMode && (
                          <div className="flex flex-wrap justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setCopiedSetup({
                                fightName: fight.name,
                                playerId: player.id,
                                playerName: player.name,
                                setup: copyFightPlayerSetup(playerStuff),
                              })}
                              className="rounded border border-[#d6b46b] bg-[#1c1c1f] px-2 py-1 text-[10px] font-bold text-white transition hover:bg-[#333]"
                            >
                              Copy setup
                            </button>
                            <button
                              type="button"
                              disabled={!copiedSetup || copiedSetup.fightName !== fight.name || copiedSetup.playerId === player.id}
                              onClick={() => {
                                if (!copiedSetup || copiedSetup.fightName !== fight.name || copiedSetup.playerId === player.id) return;
                                pasteFightPlayerSetup(fight.name, player.id, copiedSetup.setup);
                              }}
                              className="rounded border border-[#d6b46b] bg-[#d6b46b] px-2 py-1 text-[10px] font-bold text-black transition hover:bg-[#f7e7ba] disabled:cursor-not-allowed disabled:border-yellow-900 disabled:bg-[#29251a] disabled:text-yellow-800"
                            >
                              Paste setup
                            </button>
                          </div>
                        )}

                        <div className="relative group inline-block">
                          <Image src={ROLE_ICON_MAP[player.role] || ''} alt={player.role} width={40} height={40} className="w-10 h-10" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                            {player.role}
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          {[player.skillClasses.MainSkillClass, player.skillClasses.SecondSkillClass, player.skillClasses.ThirdSkillClass]
                            .filter(Boolean)
                            .map((skillLine) => {
                              const iconSrc = SKILL_LINE_ICON_MAP[skillLine] ?? '';
                              if (!iconSrc) return null;
                              return (
                                <div key={`${player.id}-${skillLine}`} className="h-8 w-8 rounded-full border border-yellow-500 bg-black/30 p-1">
                                  <Image
                                    src={iconSrc}
                                    alt={skillLine}
                                    title={skillLine}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover rounded-full"
                                  />
                                </div>
                              );
                            })}
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] text-yellow-200">
                          {[player.classMasteries.firstClassMastery, player.classMasteries.secondClassMastery]
                            .filter(Boolean)
                            .map((mastery) => (
                              <span key={`${player.id}-${mastery}`} className="rounded border border-yellow-500 bg-black/30 px-2 py-0.5">
                                {mastery}
                              </span>
                            ))}
                        </div>

                        {player.mundus ? (
                          <div className="flex items-center justify-center gap-1">
                            <Image
                              src={MUNDUS_ICON_MAP[player.mundus] ?? ''}
                              alt={player.mundus}
                              title={player.mundus}
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-full border border-yellow-500 bg-black/30 p-0.5"
                            />
                            <span className="text-[10px] text-yellow-200">{player.mundus}</span>
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-6 text-sm text-yellow-100 align-top">
                      <div className="flex min-w-56 flex-col items-center gap-3">
                        <button
                          type="button"
                          aria-pressed={showSetDetailsByPlayer[player.id] ?? false}
                          onClick={() => setShowSetDetailsByPlayer((current) => ({
                            ...current,
                            [player.id]: !(current[player.id] ?? false),
                          }))}
                          className={`rounded border px-3 py-1 text-xs font-bold transition ${
                            showSetDetailsByPlayer[player.id]
                              ? 'border-[#f8f7f2] bg-[#d6b46b] text-black'
                              : 'border-[#d6b46b] bg-[#1c1c1f] text-white hover:bg-[#333]'
                          }`}
                        >
                          Show details: {showSetDetailsByPlayer[player.id] ? 'ON' : 'OFF'}
                        </button>

                        {showSetDetailsByPlayer[player.id] ? (
                          <div className="flex min-w-[28rem] items-start justify-center gap-3">
                            {/* Jewelry column. */}
                            <div className="flex flex-col items-center gap-2 pt-8">
                              {renderSetSlot(player.id, 'necklace', 'Necklace')}
                              {renderSetSlot(player.id, 'ring1', 'Ring1')}
                              {renderSetSlot(player.id, 'ring2', 'Ring2')}
                            </div>

                            {/* Armor: silhouette-style layout, matching the build/skills visual language. */}
                            <div className="flex flex-col items-center gap-0.5">
                              {SET_LAYOUT_ROWS.map((row, rowIndex) => (
                                <div
                                  key={`set-row-${rowIndex}`}
                                  className="flex items-end justify-center gap-2"
                                >
                                  {row.map((item) => (
                                    <div
                                      key={`${player.id}-set-${item.slot}`}
                                      className={'colSpan' in item && item.colSpan ? 'mx-auto' : ''}
                                    >
                                      {renderSetSlot(player.id, item.slot, item.label)}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>

                            {/* Weapon column: front bar above back bar. */}
                            <div className="flex flex-col items-center gap-3 pt-14">
                              <div className="flex gap-2">
                                {renderSetSlot(player.id, 'mainBarWeapon1', 'Frontbar1')}
                                {renderSetSlot(player.id, 'mainBarWeapon2', 'Frontbar2')}
                              </div>
                              <div className="flex gap-2">
                                {renderSetSlot(player.id, 'backBarWeapon1', 'Backbar1')}
                                {renderSetSlot(player.id, 'backBarWeapon2', 'Backbar2')}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <ul className="w-full space-y-1 text-center text-sm text-yellow-100">
                            {setSummary.length > 0 ? (
                              setSummary.map(([setName, pieceCount]) => (
                                <li key={setName}>{setName}: {pieceCount} {pieceCount === 1 ? 'piece' : 'pieces'}</li>
                              ))
                            ) : (
                              <li className="text-xs text-yellow-200">No sets selected</li>
                            )}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-6 align-top text-sm text-yellow-100">
                      {renderActionBar(player.id, playerStuff.competencies, playerStuff.food, playerStuff.potion)}
                    </td>
                    <td className="px-4 py-6 align-top text-sm text-yellow-100">
                      {renderChampionPoints(player.id, playerStuff.championPoints)}
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
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-[#d6b46b] bg-[#111111] p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#f8f7f2]">Select an ability</h2>
              <button type="button" onClick={() => setSkillEditor(null)} className="text-2xl text-[#d6b46b] hover:text-[#f7e7ba]">×</button>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-bold text-[#f8f7f2]">Category</h3>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
                {availableSkillCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCurrentAbilityCategory(category)}
                    className={`rounded border px-3 py-2 text-xs font-bold uppercase ${
                      category === activeSkillCategory
                        ? 'border-[#f8f7f2] bg-[#d6b46b] text-black'
                        : 'border-[#d6b46b] bg-[#171717] text-[#f8f7f2] hover:border-[#f8f7f2]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-[#f8f7f2]">Ability</h3>
              <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
                {getAbilitySkillTree(activeSkillCategory, skillEditor.ultimateOnly).map(({ parent, morphs }) => (
                  <div key={parent.id} className="rounded border border-[#d6b46b]/70 bg-[#171717] p-2">
                    <button
                    key={parent.skillName}
                    type="button"
                    onClick={() => {
                      updateFightPlayerStuff(fight.name, skillEditor.playerId, skillEditor.field, parent.skillName);
                      setSkillEditor(null);
                    }}
                    className="group relative flex w-full items-center gap-3 rounded border border-[#d6b46b] bg-[#202020] p-2 text-left transition hover:border-[#f8f7f2]"
                    title={parent.skillName}
                  >
                    <div className="flex h-12 w-12 items-center justify-center">
                      <Image src={getAbilityImagePath(activeSkillCategory, parent.skillName)} alt={parent.skillName} width={40} height={40} className="h-10 w-10 object-cover" />
                    </div>
                    <span className="text-sm font-bold text-[#f8f7f2]">{parent.skillName}</span>
                  </button>
                    {morphs.length > 0 && (
                      <div className="ml-6 mt-2 grid gap-2 border-l border-[#d6b46b] pl-3 sm:grid-cols-2">
                        {morphs.map((morph) => (
                          <button
                            key={morph.id}
                            type="button"
                            onClick={() => {
                              updateFightPlayerStuff(fight.name, skillEditor.playerId, skillEditor.field, morph.skillName);
                              setSkillEditor(null);
                            }}
                            className="group relative flex items-center gap-2 rounded border border-[#8c7645] bg-[#111111] p-2 text-left transition hover:border-[#f8f7f2]"
                            title={morph.skillName}
                          >
                            <Image src={getAbilityImagePath(activeSkillCategory, morph.skillName)} alt={morph.skillName} width={36} height={36} className="h-9 w-9 object-cover" />
                            <span className="text-xs font-semibold text-[#f8f7f2]">{morph.skillName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {consumableEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-[#d6b46b] bg-[#111111] p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#f8f7f2]">
                {consumableEditor.type === 'food' ? 'Choose food' : 'Choose potion'}
              </h2>
              <button type="button" onClick={() => { setConsumableEditor(null); setFoodSearch(''); setPotionSearch(''); }} className="text-2xl text-[#d6b46b] hover:text-[#f7e7ba]">×</button>
            </div>

            {consumableEditor.type === 'food' && (
              <input
                type="search"
                value={foodSearch}
                onChange={(event) => setFoodSearch(event.target.value)}
                placeholder="Search a food..."
                aria-label="Search a food"
                className="mb-4 w-full border border-[#d6b46b] bg-[#171717] px-3 py-2 text-[#f8f7f2] outline-none placeholder:text-[#b7b5aa]/80 focus:border-[#f8f7f2]"
              />
            )}

            {consumableEditor.type === 'potion' && (
              <input
                type="search"
                value={potionSearch}
                onChange={(event) => setPotionSearch(event.target.value)}
                placeholder="Search a potion..."
                aria-label="Search a potion"
                className="mb-4 w-full border border-[#d6b46b] bg-[#171717] px-3 py-2 text-[#f8f7f2] outline-none placeholder:text-[#b7b5aa]/80 focus:border-[#f8f7f2]"
              />
            )}

            <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
              {(consumableEditor.type === 'food' ? filteredFoods : filteredPotions).map((option) => {
                const name = option.name;
                const iconMap = consumableEditor.type === 'food' ? FOOD_ICON_MAP : POTION_ICON_MAP;
                const defaultIcon = consumableEditor.type === 'food' ? DEFAULT_FOOD_ICON : DEFAULT_POTION_ICON;
                const iconSrc = name ? iconMap[name] ?? defaultIcon : null;

                return (
                  <button
                    key={name || 'empty-consumable'}
                    type="button"
                    onClick={() => {
                      updateFightPlayerStuff(fight.name, consumableEditor.playerId, consumableEditor.type, name);
                      setConsumableEditor(null);
                      setFoodSearch('');
                      setPotionSearch('');
                    }}
                    className={`flex h-14 w-14 items-center justify-center border-2 bg-[#171717] p-1 transition hover:border-[#f8f7f2] ${
                      name ? 'border-[#d6b46b]' : 'border-dashed border-[#d6b46b]'
                    }`}
                    title={name || 'None'}
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

      {championPointEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-[#d6b46b] bg-[#111111] p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#f8f7f2]">Choose a champion point</h2>
              <button type="button" onClick={() => setChampionPointEditor(null)} className="text-2xl text-[#d6b46b] hover:text-[#f7e7ba]">×</button>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#f8f7f2]">Champion point</h3>
                {(() => {
                  const slotDiscipline = getChampionPointDisciplineFromSlot(championPointEditor.field);
                  const discipline = slotDiscipline ?? ChampionPointDiscipline.TheThief;
                  return (
                    <span className={`inline-flex rounded border px-3 py-1 text-xs font-black uppercase tracking-wide ${CHAMPION_CATEGORY_STYLE[discipline]}`}>Type: {CHAMPION_DISCIPLINE_LABELS[discipline]}</span>
                  );
                })()}
              </div>
              <div className="grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto md:grid-cols-4">
                {(() => {
                  const slotDiscipline = getChampionPointDisciplineFromSlot(championPointEditor.field);
                  const discipline = slotDiscipline ?? ChampionPointDiscipline.TheThief;

                  return ChampionPointsByDiscipline[discipline]
                    .filter((championPoint) => {
                      const selectedCategory = championPointEditor.field.startsWith('Blue') ? 'Blue'
                        : championPointEditor.field.startsWith('Red') ? 'Red'
                          : championPointEditor.field.startsWith('Green') ? 'Green'
                            : '';
                      const currentCategorySlots = Object.entries(fight.playersStuff.find((entry) => entry.id === championPointEditor.playerId)?.championPoints ?? {})
                        .filter(([slot, value]) => slot.startsWith(selectedCategory) && Boolean(value))
                        .map(([, value]) => value as string);
                      return !currentCategorySlots.includes(championPoint);
                    })
                    .map((championPoint) => (
                      <button
                        key={championPoint}
                        type="button"
                        onClick={() => {
                          updateFightPlayerStuff(fight.name, championPointEditor.playerId, championPointEditor.field, championPoint);
                          setChampionPointEditor(null);
                        }}
                        className="rounded border px-3 py-2 text-left text-sm font-semibold transition hover:border-[#f8f7f2] hover:bg-[#242424]"
                        title={championPoint}
                        style={{
                          borderColor:
                            getChampionPointDisciplineFromSlot(championPointEditor.field) === ChampionPointDiscipline.TheMage
                              ? '#60a5fa'
                              : getChampionPointDisciplineFromSlot(championPointEditor.field) === ChampionPointDiscipline.TheWarrior
                                ? '#f87171'
                                : '#86efac',

                          backgroundColor:
                            getChampionPointDisciplineFromSlot(championPointEditor.field) === ChampionPointDiscipline.TheMage
                              ? '#172554'
                              : getChampionPointDisciplineFromSlot(championPointEditor.field) === ChampionPointDiscipline.TheWarrior
                                ? '#451a1a'
                                : '#052e16',

                          color: '#fde68a',
                        }}                      >
                        {championPoint}
                      </button>
                    ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {setEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-[#d6b46b] bg-[#111111] p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#f8f7f2]">Choose a set</h2>
              <button type="button" onClick={() => { setSetEditor(null); setGearDraft(null); setSetSearch(''); }} className="text-2xl text-[#d6b46b] hover:text-[#f7e7ba]">×</button>
            </div>

            {gearDraft && (
              <div className="mb-5 grid grid-cols-2 gap-3 border border-[#d6b46b] bg-[#171717] p-4">
                <div className="col-span-2 text-sm text-[#f8f7f2]">
                  <span className="text-[#d6b46b]">Selected set:</span> {gearDraft.setName || 'none'}
                </div>
                <label className="text-sm text-[#f8f7f2]">Trait<select value={gearDraft.trait} onChange={(event) => setGearDraft({ ...gearDraft, trait: event.target.value })} className="mt-1 w-full border border-[#d6b46b] bg-[#171717] p-2"><option value="">Choose</option>{availableTraits.map((trait) => <option key={trait.id} value={trait.id}>{trait.name}</option>)}</select></label>
                <label className="text-sm text-[#f8f7f2]">Enchantment<select value={gearDraft.enchantment} onChange={(event) => setGearDraft({ ...gearDraft, enchantment: event.target.value })} className="mt-1 w-full border border-[#d6b46b] bg-[#171717] p-2"><option value="">Choose</option>{availableEnchants.map((enchant) => <option key={enchant.id} value={enchant.id}>{enchant.name}</option>)}</select></label>
                {gearDraft.type === GearType.armor && <label className="text-sm text-[#f8f7f2]">Armor weight<select value={gearDraft.armorWeight ?? ''} onChange={(event) => setGearDraft({ ...gearDraft, armorWeight: event.target.value === '' ? null : Number(event.target.value) as ArmorWeight })} className="mt-1 w-full border border-[#d6b46b] bg-[#171717] p-2"><option value="">Choose</option><option value={ArmorWeight.light}>Light</option><option value={ArmorWeight.medium}>Medium</option><option value={ArmorWeight.heavy}>Heavy</option></select></label>}
                {gearDraft.type === GearType.weapon && <label className="text-sm text-[#f8f7f2]">Weapon type<select value={gearDraft.weaponType} onChange={(event) => setGearDraft({ ...gearDraft, weaponType: event.target.value })} className="mt-1 w-full border border-[#d6b46b] bg-[#171717] p-2"><option value="">Choose</option><option>One Handed</option><option>Two Handed</option><option>Bow</option><option>Destruction Staff</option><option>Restoration Staff</option></select></label>}
                <button type="button" disabled={!gearDraft.setName} onClick={() => { updateFightPlayerStuff(fight.name, setEditor.playerId, setEditor.slot, gearDraft); setSetEditor(null); setGearDraft(null); setSetSearch(''); }} className="col-span-2 border border-[#f8f7f2] bg-[#d6b46b] px-3 py-2 font-bold text-black disabled:opacity-50">Save</button>
              </div>
            )}

            <input
              type="search"
              value={setSearch}
              onChange={(event) => setSetSearch(event.target.value)}
              placeholder="Search a set..."
              aria-label="Search a set"
              className="mb-4 w-full border border-[#d6b46b] bg-[#171717] px-3 py-2 text-[#f8f7f2] outline-none placeholder:text-[#b7b5aa]/80 focus:border-[#f8f7f2]"
            />

            <div className="grid max-h-[42vh] grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3">
              {filteredSets.map((set) => (
                <button
                  key={set.id}
                  type="button"
                  onClick={() => {
                    setGearDraft((current) => current ? { ...current, setName: set.setName } : current);
                    setSetSearch(set.setName);
                  }}
                  className="rounded border border-[#d6b46b] bg-[#171717] px-3 py-2 text-left text-sm text-[#f8f7f2] transition hover:border-[#f8f7f2] hover:bg-[#242424]"
                >
                  {set.setName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

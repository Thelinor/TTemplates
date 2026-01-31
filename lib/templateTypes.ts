import { AbilityCategory } from './abilityCategories';

export interface PlayerClassMasteries {
  [className: string]: string[];
}

export interface TableauFieldNode {
  id: string;
  type: string;
  label?: string;
  playerId?: number;
  children?: TableauFieldNode[];
  value?: string;
  [key: string]: unknown;
}

export interface PlayerConfig {
  id: number;
  name: string;
  role: string;
  classes: string[];
  classMasteries?: PlayerClassMasteries;
  mundus?: string;
  sets: string[];
  bars: {
    front: string[];
    back: string[];
  };
  championPoints: { warior: string[]; mage: string[]; steed: string[] };
  food?: string;
  potion?: string;
  setup?: { [key: string]: string };
  skills?: { category: AbilityCategory; ability: string }[];
}

export interface RaidTemplate {
  version?: number;
  raidName?: string;
  raid?: {
    name?: string;
    selectedRaid?: string | null;
    players?: PlayerConfig[];
    [key: string]: unknown;
  };
  players?: Record<number, PlayerConfig> | PlayerConfig[];
  tableauFields?: TableauFieldNode[];
  [key: string]: unknown;
}

export interface RaidTemplateDocument {
  version: number;
  raid: {
    name: string;
    selectedRaid: string | null;
    players: PlayerConfig[];
    [key: string]: unknown;
  };
  tableauFields: TableauFieldNode[];
  [key: string]: unknown;
}

export function createEmptyPlayerConfig(playerId: number, playerName = `Player ${playerId}`): PlayerConfig {
  return {
    id: playerId,
    name: playerName,
    role: 'DPS',
    classes: ['', '', ''],
    classMasteries: {},
    mundus: '',
    sets: ['', ''],
    bars: {
      front: ['', '', '', '', ''],
      back: ['', '', '', '', ''],
    },
    championPoints: {
      warior: ['', '', '', ''],
      mage: ['', '', '', ''],
      steed: ['', '', '', ''],
    },
    food: '',
    potion: '',
    setup: {},
    skills: [],
  };
}

export function createEmptyTemplateDocument(): RaidTemplateDocument {
  return {
    version: 1,
    raid: {
      name: "Sanity's Edge",
      selectedRaid: null,
      players: [
        createEmptyPlayerConfig(1, 'Player 1'),
        createEmptyPlayerConfig(2, 'Player 2'),
        createEmptyPlayerConfig(3, 'Player 3'),
      ],
    },
    tableauFields: [
      {
        id: 'field-root',
        type: 'group',
        label: 'Raid',
        children: [],
      },
    ],
  };
}

const ensureArray = <T,>(value: unknown, fallback: T[]): T[] => Array.isArray(value) ? (value as T[]) : fallback;

export function normalizeTemplateDocument(input: Partial<RaidTemplateDocument> | null | undefined): RaidTemplateDocument {
  const base = createEmptyTemplateDocument();
  const source = input ?? {};

  const players = ensureArray<PlayerConfig>(source.raid?.players, base.raid.players).map((player, index) => ({
    ...createEmptyPlayerConfig(index + 1, player?.name || `Player ${index + 1}`),
    ...player,
    role: player?.role || 'DPS',
    classes: ensureArray<string>(player?.classes, ['', '', '']),
    sets: ensureArray<string>(player?.sets, ['', '']),
    bars: {
      front: ensureArray<string>(player?.bars?.front, ['', '', '', '', '']),
      back: ensureArray<string>(player?.bars?.back, ['', '', '', '', '']),
    },
    championPoints: {
      warior: ensureArray<string>(player?.championPoints?.warior, ['', '', '', '']),
      mage: ensureArray<string>(player?.championPoints?.mage, ['', '', '', '']),
      steed: ensureArray<string>(player?.championPoints?.steed, ['', '', '', '']),
    },
    setup: player?.setup ?? {},
    classMasteries: player?.classMasteries ?? {},
    skills: Array.isArray(player?.skills) ? player.skills : [],
  }));

  return {
    version: Number(source.version ?? 1),
    raid: {
      ...base.raid,
      ...(source.raid ?? {}),
      name: (source.raid?.name as string | undefined) || base.raid.name,
      selectedRaid: (source.raid?.selectedRaid as string | null | undefined) ?? null,
      players,
    },
    tableauFields: ensureArray<TableauFieldNode>(source.tableauFields, base.tableauFields),
    ...source,
  };
}

export function exportTemplateDocument(template: RaidTemplateDocument): string {
  return JSON.stringify(normalizeTemplateDocument(template), null, 2);
}

export function parseTemplateDocument(input: string | unknown): RaidTemplateDocument {
  const parsed = typeof input === 'string' ? JSON.parse(input) : input;
  return normalizeTemplateDocument(parsed as Partial<RaidTemplateDocument>);
}

export function createTemplateFromRaidData(
  raidName: string,
  players: Array<{
    id: number;
    name: string;
    role: string;
    classes: string[];
    championPoints: { warior: string[]; mage: string[]; steed: string[] };
    classMasteries?: PlayerClassMasteries;
    mundus?: string;
    sets?: string[];
  }>,
  equipmentSlots: string[] = []
): RaidTemplateDocument {
  return normalizeTemplateDocument({
    version: 1,
    raid: {
      name: raidName,
      selectedRaid: raidName,
      players: players.map((player, index) => ({
        ...createEmptyPlayerConfig(player.id || index + 1, player.name),
        role: player.role,
        classes: player.classes,
        classMasteries: player.classMasteries ?? {},
        mundus: player.mundus ?? '',
        sets: player.sets ?? ['', ''],
        championPoints: {
          warior: [...(player.championPoints?.warior ?? ['', '', '', ''])],
          mage: [...(player.championPoints?.mage ?? ['', '', '', ''])],
          steed: [...(player.championPoints?.steed ?? ['', '', '', ''])],
        },
        setup: equipmentSlots.reduce((acc, slot) => ({ ...acc, [slot]: '' }), {}),
      })),
    },
    tableauFields: [],
  });
}

export function importTemplate(json: string): RaidTemplateDocument {
  return parseTemplateDocument(json);
}

export function exportTemplate(template: RaidTemplateDocument): string {
  return exportTemplateDocument(template);
}

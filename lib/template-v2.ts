export enum RoleType {
  Tank,
  Heal,
  DPS
}

export enum SkillClass {
  'Earthen Heart',
  'Draconic Power',
  'Ardent Flame',
  'Aedric Spear',
  "Dawn's Wrath",
  "Purifying Light",
  'Daedric Summoning',
  'Dark Magic',
  'Storm Calling',
  'Assassination',
  'Shadowy Embrace',
  'Siphoning',
  'Green Balance',
  "Winter's Embrace",
  'Animal Companions',
  'Grave Lord',
  'Living Death',
  "Bone Tyrant",
  "Curative Runeforms",
  "Herald of the Tomes",
  "Soldier of Apocrypha",
}

export enum ClassMastery {
  "TODO",
}
export type SkillClasses = {
  MainSkillClass: SkillClass;
  SecondSkillClass: SkillClass;
  ThirdSkillClass: SkillClass;
}

export type ClassMasteries = {
  firstClassMastery: ClassMastery;
  secondClassMastery: ClassMastery;
}

export type Effect = {
  numberOfPiecesRequired: number;
  buffDebuffIds: number[];
}
export type Set = {
  id: number;
  effects: Effect[];
}

export enum ArmorWeight {
  light,
  medium,
  heavy,
}

export enum GearType {
  armor,
  jewelry,
  weapon,
}

export enum WeaponType {
  // TODO
}
export type GearPiece = {
  type: GearType
  setName: Set;
  armorWeight: ArmorWeight;
  trait: Trait;
  enchantment: Enchant
  weaponType: WeaponType
}

export enum Trait {
  divine,
}

export enum Enchant {
  // TODO
}

export enum MundusStone {

}
export type Gear = {
  head: GearPiece;
  chest: GearPiece;
  waist: GearPiece;
  boots: GearPiece;
  shoulders: GearPiece;
  gloves: GearPiece;
  legs: GearPiece;
  ring1: GearPiece;
  ring2: GearPiece;
  necklace: GearPiece;
  mainBarWeapon1: GearPiece;
  mainBarWeapon2: GearPiece;
  backBarWeapon1: GearPiece;
  backBarWeapon2: GearPiece;
}

export type Skills = {
  MainBar1: string;
  MainBar2: string;
  MainBar3: string;
  MainBar4: string;
  MainBar5: string;
  MainBarUlt: string;
  BackBar1: string;
  BackBar2: string;
  BackBar3: string;
  BackBar4: string;
  BackBar5: string;
  BackBarUlt: string;
}

export type ChampionPoints = {
  Blue1: string;
  Blue2: string;
  Blue3: string;
  Blue4: string;
  Red1: string;
  Red2: string;
  Red3: string;
  Red4: string;
  Green1: string;
  Green2: string;
  Green3: string;
  Green4: string;
}

export type RaidPlayer = {
  id: number;
  name: string;
  role: RoleType;
  skillClasses: SkillClasses;
  classMasteries: ClassMasteries;
  mundus: MundusStone;
}

export type FightPlayerStuff = {
  id: number;
  name: string;
  role: RoleType;
  sets: Gear;
  competencies: Skills;
  championPoints: ChampionPoints;
  food: string;
  potion: string;
}

export type Encounter = {
  name: string;
  playersStuff: FightPlayerStuff[];
}

export type RaidTemplateDocument = {
  version: number;
  raid: {
    groupName: string;
    selectedRaid: string | null;
    players: RaidPlayer[];
  };
  fights: FightDefinition[];
}

export function createEmptySkillClasses(): SkillClasses {
  return {
    MainSkillClass: '',
    SecondSkillClass: '',
    ThirdSkillClass: '',
  };
}

export function createEmptyClassMasteries(): ClassMasteries {
  return {
    firstClassMastery: '',
    secondClassMastery: '',
  };
}

export function createEmptySetMap(): SetMap {
  return {
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
  };
}

export function createEmptyCompetencyMap(): CompetencyMap {
  return {
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
  };
}

export function createEmptyChampionPointsMap(): ChampionPointsMap {
  return {
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
  };
}

export function createEmptyPlayer(id: number, name = `Player ${id}`): RaidPlayer {
  return {
    id,
    name,
    role: 'DPS',
    skillClasses: createEmptySkillClasses(),
    classMasteries: createEmptyClassMasteries(),
    mundus: '',
  };
}

export function createEmptyFightPlayerStuff(player: RaidPlayer): FightPlayerStuff {
  return {
    id: player.id,
    name: player.name,
    role: player.role,
    sets: createEmptySetMap(),
    competencies: createEmptyCompetencyMap(),
    championPoints: createEmptyChampionPointsMap(),
    food: '',
    potion: '',
  };
}

export function createEmptyTemplateDocument(): RaidTemplateDocument {
  const players = [
    createEmptyPlayer(1, 'Thranduil'),
    createEmptyPlayer(2, 'Celebrimbor'),
    createEmptyPlayer(3, 'Fingolfin'),
  ];

  return {
    version: 1,
    raid: {
      groupName: "Thelinor's Trap",
      selectedRaid: "Sanity's Edge",
      players,
    },
    fights: [
      {
        name: 'Taleria',
        playersStuff: players.map((player) => createEmptyFightPlayerStuff(player)),
      },
    ],
  };
}

export function normalizeTemplateDocument(input: Partial<RaidTemplateDocument> | null | undefined): RaidTemplateDocument {
  const base = createEmptyTemplateDocument();
  const source = input ?? {};

  const players = (Array.isArray(source.raid?.players) ? source.raid!.players : base.raid.players).map((player, index) => ({
    id: Number(player?.id ?? index + 1),
    name: typeof player?.name === 'string' ? player.name : `Player ${index + 1}`,
    role: (player?.role as RoleType) || 'DPS',
    skillClasses: {
      MainSkillClass: typeof player?.skillClasses?.MainSkillClass === 'string' ? player.skillClasses.MainSkillClass : '',
      SecondSkillClass: typeof player?.skillClasses?.SecondSkillClass === 'string' ? player.skillClasses.SecondSkillClass : '',
      ThirdSkillClass: typeof player?.skillClasses?.ThirdSkillClass === 'string' ? player.skillClasses.ThirdSkillClass : '',
    },
    classMasteries: {
      firstClassMastery: typeof player?.classMasteries?.firstClassMastery === 'string' ? player.classMasteries.firstClassMastery : '',
      secondClassMastery: typeof player?.classMasteries?.secondClassMastery === 'string' ? player.classMasteries.secondClassMastery : '',
    },
    mundus: typeof player?.mundus === 'string' ? player.mundus : '',
  }));

  const fights = (Array.isArray(source.fights) ? source.fights : base.fights).map((fight, fightIndex) => ({
    name: typeof fight?.name === 'string' ? fight.name : `Fight ${fightIndex + 1}`,
    playersStuff: (Array.isArray(fight?.playersStuff) ? fight.playersStuff : players.map((player) => createEmptyFightPlayerStuff(player))).map((entry, index) => ({
      id: Number(entry?.id ?? players[index]?.id ?? index + 1),
      name: typeof entry?.name === 'string' ? entry.name : players[index]?.name ?? `Player ${index + 1}`,
      role: (entry?.role as RoleType) || players[index]?.role || 'DPS',
      sets: { ...createEmptySetMap(), ...(entry?.sets ?? {}) },
      competencies: { ...createEmptyCompetencyMap(), ...(entry?.competencies ?? {}) },
      championPoints: { ...createEmptyChampionPointsMap(), ...(entry?.championPoints ?? {}) },
      food: typeof entry?.food === 'string' ? entry.food : '',
      potion: typeof entry?.potion === 'string' ? entry.potion : '',
    })),
  }));

  return {
    version: Number(source.version ?? 1),
    raid: {
      groupName: typeof source.raid?.groupName === 'string' ? source.raid.groupName : base.raid.groupName,
      selectedRaid: source.raid?.selectedRaid ?? base.raid.selectedRaid,
      players,
    },
    fights,
  };
}

export function parseTemplateDocument(input: string | object): RaidTemplateDocument {
  const parsed = typeof input === 'string' ? JSON.parse(input) : input;
  return normalizeTemplateDocument(parsed as Partial<RaidTemplateDocument>);
}

export function exportTemplateDocument(template: RaidTemplateDocument): string {
  return JSON.stringify(normalizeTemplateDocument(template), null, 2);
}

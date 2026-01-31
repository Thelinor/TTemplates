export const RoleType = {
  Tank: 'Tank',
  Heal: 'Heal',
  DPS: 'DPS',
} as const;
export type RoleType = typeof RoleType[keyof typeof RoleType];

export const CommonSkillLine = {
  Empty: '',
  FightersGuild: "Fighter's Guild",
  MagesGuild: "Mage's Guild",
  Undaunted: 'Undaunted',
  PsijicOrder: 'Psijic Order',
  Vampire: 'Vampire',
  Werewolf: 'Werewolf',
  OneHanded: 'One Handed',
  TwoHanded: 'Two Handed',
  DualWield: 'Dual Wield',
  Bow: 'Bow',
  DestructionStaff: 'Destruction Staff',
  RestorationStaff: 'Restoration Staff',
  SoulMagic: 'Soul Magic',
  Armor: 'Armor',
  Assault: 'Assault',
  Support: 'Support',
}
export type CommonSkillLine = typeof CommonSkillLine[keyof typeof CommonSkillLine];

export const ClassName = {
  Templar: 'Templar',
  Sorcerer: 'Sorcerer',
  Nightblade: 'Nightblade',
  Dragonknight: 'Dragonknight',
  Warden: 'Warden',
  Necromancer: 'Necromancer',
  Arcanist: 'Arcanist',
} as const;
export type ClassName = typeof ClassName[keyof typeof ClassName];

export const ClassSkillLine = {
  Empty: '',
  EarthenHeart: 'Earthen Heart',
  DraconicPower: 'Draconic Power',
  ArdentFlame: 'Ardent Flame',
  AedricSpear: 'Aedric Spear',
  DawnsWrath: "Dawn's Wrath",
  RestoringLight: 'Restoring Light',
  DaedricSummoning: 'Daedric Summoning',
  DarkMagic: 'Dark Magic',
  StormCalling: 'Storm Calling',
  Assassination: 'Assassination',
  ShadowyEmbrace: 'Shadowy Embrace',
  Siphoning: 'Siphoning',
  GreenBalance: 'Green Balance',
  WintersEmbrace: "Winter's Embrace",
  AnimalCompanions: 'Animal Companions',
  GraveLord: 'Grave Lord',
  LivingDeath: 'Living Death',
  BoneTyrant: 'Bone Tyrant',
  CurativeRuneforms: 'Curative Runeforms',
  HeraldOfTheTomes: 'Herald of the Tomes',
  SoldierOfApocrypha: 'Soldier of Apocrypha',
} as const;
export type ClassSkillLine = typeof ClassSkillLine[keyof typeof ClassSkillLine];

export type SkillAbility = {
  id: number;
  skillLine: ClassSkillLine | CommonSkillLine;
  skillName: string;
  /** True when this ability may be assigned to an ultimate (sixth) bar slot. */
  isUltimate: boolean;
  /** Name of the base ability this morph belongs to, or null for a root ability. */
  parentSkillName: string | null;
};



export type Food = {
  id: number;
  name: string;
}

export type Potion = {
  id: number;
  name: string;
}

export type Enchant = {
  id: number,
  name: string;
  gearType: GearType,
}

export type Trait = {
  id: number,
  name: string;
  gearType: GearType,

}
export const ChampionPointName = {
  AnglersInstincts: "Angler's Instincts",
  FadeAway: 'Fade Away',
  FriendsInLowPlaces: 'Friends in Low Places',
  GiftedRider: 'Gifted Rider',
  MasterGatherer: 'Master Gatherer',
  ReelTechnique: 'Reel Technique',
  Shadowstrike: 'Shadowstrike',
  SteedsBlessing: "Steed's Blessing",
  SustainingShadows: 'Sustaining Shadows',
  WarMount: 'War Mount',
  ArcaneSupremacy: 'Arcane Supremacy',
  Backstabber: 'Backstabber',
  BitingAura: 'Biting Aura',
  Bulwark: 'Bulwark',
  CleansingRevival: 'Cleansing Revival',
  CuttingDefense: 'Cutting Defense',
  DeadlyAim: 'Deadly Aim',
  DuelistsRebuff: "Duelist's Rebuff",
  EndlessEndurance: 'Endless Endurance',
  EnduringResolve: 'Enduring Resolve',
  EnliveningOverflow: 'Enlivening Overflow',
  Exploiter: 'Exploiter',
  FightingFinesse: 'Fighting Finesse',
  FocusedMending: 'Focused Mending',
  ForceOfNature: 'Force of Nature',
  Foresight: 'Foresight',
  FromTheBrink: 'From the Brink',
  HopeInfusion: 'Hope Infusion',
  Ironclad: 'Ironclad',
  LastStand: 'Last Stand',
  MasterAtArms: 'Master-at-Arms',
  OccultOverload: 'Occult Overload',
  ReavingBlows: 'Reaving Blows',
  Reinforced: 'Reinforced',
  Rejuvenator: 'Rejuvenator',
  Resilience: 'Resilience',
  Riposte: 'Riposte',
  SalveOfRenewal: 'Salve of Renewal',
  SoothingTide: 'Soothing Tide',
  SwiftRenewal: 'Swift Renewal',
  Thaumaturge: 'Thaumaturge',
  Unassailable: 'Unassailable',
  UntamedAggression: 'Untamed Aggression',
  WeaponsExpert: 'Weapons Expert',
  WrathfulStrikes: 'Wrathful Strikes',
  ArcaneAlacrity: 'Arcane Alacrity',
  Bastion: 'Bastion',
  BloodyRenewal: 'Bloody Renewal',
  BoundlessVitality: 'Boundless Vitality',
  BracingAnchor: 'Bracing Anchor',
  Celerity: 'Celerity',
  ExpertEvasion: 'Expert Evasion',
  Fortified: 'Fortified',
  Hardened: 'Hardened',
  Juggernaut: 'Juggernaut',
  OnGuard: 'On Guard',
  PainsRefuge: "Pain's Refuge",
  PeaceOfMind: 'Peace of Mind',
  RefreshingStride: 'Refreshing Stride',
  Rejuvenation: 'Rejuvenation',
  Relentlessness: 'Relentlessness',
  RousingSpeed: 'Rousing Speed',
  ShieldMaster: 'Shield Master',
  SiphoningSpells: 'Siphoning Spells',
  Slippery: 'Slippery',
  SoothingShield: 'Soothing Shield',
  SpiritMastery: 'Spirit Mastery',
  StrategicReserve: 'Strategic Reserve',
  SurvivalInstincts: 'Survival Instincts',
  SustainedBySuffering: 'Sustained by Suffering',
  ThrillOfTheHunt: 'Thrill of the Hunt',
  Unchained: 'Unchained',
  WardMaster: 'Ward Master',
} as const;
export type ChampionPointName = typeof ChampionPointName[keyof typeof ChampionPointName];

export const ChampionPointDiscipline = {
  TheThief: 'The Thief',
  TheMage: 'The Mage',
  TheWarrior: 'The Warrior',
} as const;
export type ChampionPointDiscipline = typeof ChampionPointDiscipline[keyof typeof ChampionPointDiscipline];

export const ChampionPointsByDiscipline = {
  [ChampionPointDiscipline.TheWarrior]: [
    ChampionPointName.ArcaneAlacrity,
    ChampionPointName.Bastion,
    ChampionPointName.BloodyRenewal,
    ChampionPointName.BoundlessVitality,
    ChampionPointName.BracingAnchor,
    ChampionPointName.Celerity,
    ChampionPointName.ExpertEvasion,
    ChampionPointName.Fortified,
    ChampionPointName.Hardened,
    ChampionPointName.Juggernaut,
    ChampionPointName.OnGuard,
    ChampionPointName.PainsRefuge,
    ChampionPointName.PeaceOfMind,
    ChampionPointName.RefreshingStride,
    ChampionPointName.Rejuvenation,
    ChampionPointName.Relentlessness,
    ChampionPointName.RousingSpeed,
    ChampionPointName.ShieldMaster,
    ChampionPointName.SiphoningSpells,
    ChampionPointName.Slippery,
    ChampionPointName.SoothingShield,
    ChampionPointName.SpiritMastery,
    ChampionPointName.StrategicReserve,
    ChampionPointName.SurvivalInstincts,
    ChampionPointName.SustainedBySuffering,
    ChampionPointName.ThrillOfTheHunt,
    ChampionPointName.Unchained,
    ChampionPointName.WardMaster,
  ],
  [ChampionPointDiscipline.TheThief]: [
    ChampionPointName.AnglersInstincts,
    ChampionPointName.FadeAway,
    ChampionPointName.FriendsInLowPlaces,
    ChampionPointName.GiftedRider,
    ChampionPointName.MasterGatherer,
    ChampionPointName.ReelTechnique,
    ChampionPointName.Shadowstrike,
    ChampionPointName.SteedsBlessing,
    ChampionPointName.SustainingShadows,
    ChampionPointName.WarMount,
  ],
  [ChampionPointDiscipline.TheMage]: [
    ChampionPointName.ArcaneSupremacy,
    ChampionPointName.Backstabber,
    ChampionPointName.BitingAura,
    ChampionPointName.Bulwark,
    ChampionPointName.CleansingRevival,
    ChampionPointName.CuttingDefense,
    ChampionPointName.DeadlyAim,
    ChampionPointName.DuelistsRebuff,
    ChampionPointName.EndlessEndurance,
    ChampionPointName.EnduringResolve,
    ChampionPointName.EnliveningOverflow,
    ChampionPointName.Exploiter,
    ChampionPointName.FightingFinesse,
    ChampionPointName.FocusedMending,
    ChampionPointName.ForceOfNature,
    ChampionPointName.Foresight,
    ChampionPointName.FromTheBrink,
    ChampionPointName.HopeInfusion,
    ChampionPointName.Ironclad,
    ChampionPointName.LastStand,
    ChampionPointName.MasterAtArms,
    ChampionPointName.OccultOverload,
    ChampionPointName.ReavingBlows,
    ChampionPointName.Reinforced,
    ChampionPointName.Rejuvenator,
    ChampionPointName.Resilience,
    ChampionPointName.Riposte,
    ChampionPointName.SalveOfRenewal,
    ChampionPointName.SoothingTide,
    ChampionPointName.SwiftRenewal,
    ChampionPointName.Thaumaturge,
    ChampionPointName.Unassailable,
    ChampionPointName.UntamedAggression,
    ChampionPointName.WeaponsExpert,
    ChampionPointName.WrathfulStrikes,
  ],
} as const;

export function getChampionPointDisciplineFromSlot(field: string): ChampionPointDiscipline | null {
  if (field.startsWith('Blue')) return ChampionPointDiscipline.TheMage;
  if (field.startsWith('Red')) return ChampionPointDiscipline.TheWarrior;
  if (field.startsWith('Green')) return ChampionPointDiscipline.TheThief;
  return null;
}

export function getChampionPointDisciplineFromName(name: ChampionPointName | ''): ChampionPointDiscipline | null {
  if (!name) return null;

  const disciplineEntries = Object.entries(ChampionPointsByDiscipline) as Array<
    [ChampionPointDiscipline, readonly ChampionPointName[]]
  >;

  for (const [discipline, names] of disciplineEntries) {
    if (names.includes(name)) {
      return discipline;
    }
  }

  return null;
}

export const MundusStone = {
  Empty: '',
  Apprentice: 'The Apprentice',
  Atronach: 'The Atronach',
  Lady: 'The Lady',
  Lord: 'The Lord',
  Lover: 'The Lover',
  Mage: 'The Mage',
  Ritual: 'The Ritual',
  Serpent: 'The Serpent',
  Shadow: 'The Shadow',
  Steed: 'The Steed',
  Thief: 'The Thief',
  Tower: 'The Tower',
  Warrior: 'The Warrior',
} as const;
export type MundusStone = typeof MundusStone[keyof typeof MundusStone];

export type SkillClasses = {
  MainSkillClass: ClassSkillLine;
  SecondSkillClass: ClassSkillLine;
  ThirdSkillClass: ClassSkillLine;
}

export const TemplarClassMasteries = {
  Mastery1: 'Bastion of Light',
  Mastery2: 'Devout Guardian',
  Mastery3: 'Bright Harbinger',
  Mastery4: "Judgment's Brand",
  Mastery5: 'Steadfast Candescence',
} as const;
export type TemplarClassMastery = typeof TemplarClassMasteries[keyof typeof TemplarClassMasteries];

export const SorcererClassMasteries = {
  Mastery1: 'Conservation of Energy',
  Mastery2: 'Font of Power',
  Mastery3: 'Static Reverberation',
  Mastery4: 'Calculated Defense',
  Mastery5: 'Sphere of Influence',
} as const;
export type SorcererClassMastery = typeof SorcererClassMasteries[keyof typeof SorcererClassMasteries];

export const NightbladeClassMasteries = {
  Mastery1: 'Nocturnal Inspiration',
  Mastery2: 'An Eye for Exploitation',
  Mastery3: 'Above and Beyond',
  Mastery4: "Cutthroat's Focus",
  Mastery5: 'Share the Spoils',
} as const;
export type NightbladeClassMastery = typeof NightbladeClassMasteries[keyof typeof NightbladeClassMasteries];

export const DragonknightClassMasteries = {
  Mastery1: 'Inexorable Descent',
  Mastery2: 'Booming Voice',
  Mastery3: 'Wildfire Embers',
  Mastery4: 'Resolute Defense',
  Mastery5: 'Lead from the Front',
} as const;
export type DragonknightClassMastery = typeof DragonknightClassMasteries[keyof typeof DragonknightClassMasteries];

export const WardenClassMasteries = {
  Mastery1: "Tundra's Maw",
  Mastery2: 'Wild Adaptation',
  Mastery3: 'Glacial Obstinance',
  Mastery4: "Green-Keeper's Hide",
  Mastery5: 'Bountiful Harvest',
} as const;
export type WardenClassMastery = typeof WardenClassMasteries[keyof typeof WardenClassMasteries];

export const NecromancerClassMasteries = {
  Mastery1: 'Nothing Wasted',
  Mastery2: 'Malevolent Promise',
  Mastery3: 'Cycle Unending',
  Mastery4: 'Pound of Flesh',
  Mastery5: "Veil's Forfeit",
} as const;
export type NecromancerClassMastery = typeof NecromancerClassMasteries[keyof typeof NecromancerClassMasteries];

export const ArcanistClassMasteries = {
  Mastery1: 'Abyssal Emergence',
  Mastery2: 'Fate Realigned',
  Mastery3: 'Unbound Potential',
  Mastery4: "Erudite's Rigor",
  Mastery5: "Ink-Scribe's Verve",
} as const;
export type ArcanistClassMastery = typeof ArcanistClassMasteries[keyof typeof ArcanistClassMasteries];

export const CLASS_MASTERY_OPTIONS_BY_CLASS: Record<ClassName, readonly string[]> = {
  [ClassName.Templar]: Object.values(TemplarClassMasteries),
  [ClassName.Sorcerer]: Object.values(SorcererClassMasteries),
  [ClassName.Nightblade]: Object.values(NightbladeClassMasteries),
  [ClassName.Dragonknight]: Object.values(DragonknightClassMasteries),
  [ClassName.Warden]: Object.values(WardenClassMasteries),
  [ClassName.Necromancer]: Object.values(NecromancerClassMasteries),
  [ClassName.Arcanist]: Object.values(ArcanistClassMasteries),
};

export type ClassMasteries = {
  firstClassMastery: string;
  secondClassMastery: string;
}

export type Set = {
  id: number;
  setName: string;
  effects: {
    numberOfPiecesRequired: number;
    buffDebuffIds: number[];
  }[];
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

export type GearPiece = {
  type: GearType;
  setName: string;
  armorWeight: ArmorWeight | null;
  trait: string;
  enchantment: string;
  weaponType: string;
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
  Blue1: ChampionPointName | '';
  Blue2: ChampionPointName | '';
  Blue3: ChampionPointName | '';
  Blue4: ChampionPointName | '';
  Red1: ChampionPointName | '';
  Red2: ChampionPointName | '';
  Red3: ChampionPointName | '';
  Red4: ChampionPointName | '';
  Green1: ChampionPointName | '';
  Green2: ChampionPointName | '';
  Green3: ChampionPointName | '';
  Green4: ChampionPointName | '';
}

export type RaidPlayer = {
  id: number;
  name: string;
  role: RoleType;
  skillClasses: SkillClasses;
  classMasteries: ClassMasteries;
  mundus: MundusStone;
}

export type SetSlot =
  | 'head'
  | 'chest'
  | 'waist'
  | 'boots'
  | 'shoulders'
  | 'gloves'
  | 'legs'
  | 'ring1'
  | 'ring2'
  | 'necklace'
  | 'mainBarWeapon1'
  | 'mainBarWeapon2'
  | 'backBarWeapon1'
  | 'backBarWeapon2';

export type SetSlots = Record<SetSlot, GearPiece>;

const TWO_HANDED_WEAPON_TYPES = new Set([
  'Two Handed',
  'Bow',
  'Destruction Staff',
  'Restoration Staff',
]);

export function requiresTwoWeaponSlots(gear: GearPiece): boolean {
  return gear.type === GearType.weapon && TWO_HANDED_WEAPON_TYPES.has(gear.weaponType);
}

export function getPairedWeaponSlot(slot: SetSlot): SetSlot | null {
  const pairedSlots: Partial<Record<SetSlot, SetSlot>> = {
    mainBarWeapon1: 'mainBarWeapon2',
    mainBarWeapon2: 'mainBarWeapon1',
    backBarWeapon1: 'backBarWeapon2',
    backBarWeapon2: 'backBarWeapon1',
  };

  return pairedSlots[slot] ?? null;
}

/**
 * Stores a two-handed weapon in both slots of its bar. Editing either half of
 * an existing two-handed weapon also updates its pair, including when it is
 * changed back to a one-handed weapon.
 */
export function updateSetSlot(sets: SetSlots, slot: SetSlot, gear: GearPiece): SetSlots {
  const pairedSlot = getPairedWeaponSlot(slot);
  const shouldUpdatePair = pairedSlot && (requiresTwoWeaponSlots(gear) || requiresTwoWeaponSlots(sets[slot]));

  return {
    ...sets,
    [slot]: gear,
    ...(shouldUpdatePair ? { [pairedSlot]: { ...gear } } : {}),
  };
}

export function createEmptyGearPiece(type: GearType = GearType.armor): GearPiece {
  return {
    type,
    setName: '',
    armorWeight: type === GearType.armor ? ArmorWeight.light : null,
    trait: '',
    enchantment: '',
    weaponType: '',
  };
}

const SET_SLOTS: SetSlot[] = [
  'head', 'chest', 'waist', 'boots', 'shoulders', 'gloves', 'legs',
  'ring1', 'ring2', 'necklace', 'mainBarWeapon1', 'mainBarWeapon2',
  'backBarWeapon1', 'backBarWeapon2',
];

export function createEmptySetSlots(): SetSlots {
  return Object.fromEntries(SET_SLOTS.map((slot) => [slot, createEmptyGearPiece()])) as SetSlots;
}

export type FightPlayerStuff = {
  id: number;
  name: string;
  role: RoleType;
  sets: SetSlots;
  competencies: Skills;
  championPoints: ChampionPoints;
  food: string;
  potion: string;
}

/**
 * The editable encounter data that can be copied from one player to another.
 * Player identity and role deliberately stay out of a setup copy.
 */
export type FightPlayerSetup = Pick<
  FightPlayerStuff,
  'sets' | 'competencies' | 'championPoints' | 'food' | 'potion'
>;

/**
 * Creates an independent JSON-compatible snapshot of a player's encounter
 * setup. A deep clone is important here: later edits to the source player must
 * not alter the setup waiting to be pasted.
 */
export function copyFightPlayerSetup(playerStuff: FightPlayerStuff): FightPlayerSetup {
  return JSON.parse(JSON.stringify({
    sets: playerStuff.sets,
    competencies: playerStuff.competencies,
    championPoints: playerStuff.championPoints,
    food: playerStuff.food,
    potion: playerStuff.potion,
  })) as FightPlayerSetup;
}

/**
 * Replaces only the setup portion of a fight player while retaining the
 * destination player's id, name and role.
 */
export function pasteFightPlayerSetup(playerStuff: FightPlayerStuff, setup: FightPlayerSetup): FightPlayerStuff {
  return {
    ...playerStuff,
    ...copyFightPlayerSetup({ ...playerStuff, ...setup }),
  };
}

export type Encounter = {
  name: string;
  playersStuff: FightPlayerStuff[];
}

export type FightDefinition = {
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

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

const isEnumValue = <T extends string>(enumObject: Record<string, T>, value: unknown): value is T => (
  typeof value === 'string' && Object.values(enumObject).includes(value as T)
);

export function normalizeTemplateDocument(input: unknown): RaidTemplateDocument {
  const base = createEmptyTemplateDocument();
  const source = isRecord(input) ? input : {};
  const raidSource = isRecord(source.raid) ? source.raid : {};

  const raidPlayers = Array.isArray(raidSource.players) ? raidSource.players : base.raid.players;
  const fights = Array.isArray(source.fights) ? source.fights : base.fights;

  const players: RaidPlayer[] = raidPlayers.map((player, index) => ({
    id: isRecord(player) && typeof player.id === 'number' ? player.id : index + 1,
    name: isRecord(player) && typeof player.name === 'string' ? player.name : `Player ${index + 1}`,
    role: isRecord(player) && isEnumValue(RoleType, player.role) ? player.role : RoleType.DPS,
    skillClasses: {
      MainSkillClass: isRecord(player) && isRecord(player.skillClasses) && isEnumValue(ClassSkillLine, player.skillClasses.MainSkillClass) ? player.skillClasses.MainSkillClass : ClassSkillLine.Empty,
      SecondSkillClass: isRecord(player) && isRecord(player.skillClasses) && isEnumValue(ClassSkillLine, player.skillClasses.SecondSkillClass) ? player.skillClasses.SecondSkillClass : ClassSkillLine.Empty,
      ThirdSkillClass: isRecord(player) && isRecord(player.skillClasses) && isEnumValue(ClassSkillLine, player.skillClasses.ThirdSkillClass) ? player.skillClasses.ThirdSkillClass : ClassSkillLine.Empty,
    },
    classMasteries: {
      firstClassMastery: isRecord(player) && isRecord(player.classMasteries) && typeof player.classMasteries.firstClassMastery === 'string' ? player.classMasteries.firstClassMastery : '',
      secondClassMastery: isRecord(player) && isRecord(player.classMasteries) && typeof player.classMasteries.secondClassMastery === 'string' ? player.classMasteries.secondClassMastery : '',
    },
    mundus: isRecord(player) && isEnumValue(MundusStone, player.mundus) ? player.mundus : MundusStone.Empty,
  }));

  const fightsNormalized: FightDefinition[] = fights.map((fight, fightIndex) => {
    const fightRecord = isRecord(fight) ? fight : {};
    const fightName = typeof fightRecord.name === 'string' ? fightRecord.name : `Fight ${fightIndex + 1}`;
    const fightPlayers = Array.isArray(fightRecord.playersStuff) ? fightRecord.playersStuff : [];

    return {
      name: fightName,
      playersStuff: fightPlayers.map((entry, index) => {
        const entryRecord = isRecord(entry) ? entry : {};
        const player = players[index] ?? createEmptyPlayer(index + 1);
        const playerRole = isEnumValue(RoleType, player.role) ? player.role : RoleType.DPS;
        const competencies = isRecord(entryRecord.competencies) ? entryRecord.competencies : {};
        const championPoints = isRecord(entryRecord.championPoints) ? entryRecord.championPoints : {};
        return {
          id: typeof entryRecord.id === 'number' ? entryRecord.id : player.id,
          name: typeof entryRecord.name === 'string' ? entryRecord.name : player.name,
          role: isEnumValue(RoleType, entryRecord.role) ? entryRecord.role : playerRole,
          sets: SET_SLOTS.reduce<SetSlots>((sets, slot) => {
            const rawSet = isRecord(entryRecord.sets) ? entryRecord.sets[slot] : undefined;
            const slotType = slot.includes('Weapon')
              ? GearType.weapon
              : slot.includes('ring') || slot === 'necklace'
                ? GearType.jewelry
                : GearType.armor;
            if (typeof rawSet === 'string') {
              sets[slot] = { ...createEmptyGearPiece(slotType), setName: rawSet };
            } else if (isRecord(rawSet)) {
              sets[slot] = {
                type: slotType,
                setName: typeof rawSet.setName === 'string' ? rawSet.setName : '',
                armorWeight: slotType === GearType.armor && Object.values(ArmorWeight).includes(rawSet.armorWeight as ArmorWeight)
                  ? rawSet.armorWeight as ArmorWeight
                  : null,
                trait: typeof rawSet.trait === 'string' ? rawSet.trait : '',
                enchantment: typeof rawSet.enchantment === 'string' ? rawSet.enchantment : '',
                weaponType: typeof rawSet.weaponType === 'string' ? rawSet.weaponType : '',
              };
            } else {
              sets[slot] = createEmptyGearPiece();
            }
            return sets;
          }, createEmptySetSlots()),
          competencies: {
            MainBar1: typeof competencies.MainBar1 === 'string' ? competencies.MainBar1 : '',
            MainBar2: typeof competencies.MainBar2 === 'string' ? competencies.MainBar2 : '',
            MainBar3: typeof competencies.MainBar3 === 'string' ? competencies.MainBar3 : '',
            MainBar4: typeof competencies.MainBar4 === 'string' ? competencies.MainBar4 : '',
            MainBar5: typeof competencies.MainBar5 === 'string' ? competencies.MainBar5 : '',
            MainBarUlt: typeof competencies.MainBarUlt === 'string' ? competencies.MainBarUlt : '',
            BackBar1: typeof competencies.BackBar1 === 'string' ? competencies.BackBar1 : '',
            BackBar2: typeof competencies.BackBar2 === 'string' ? competencies.BackBar2 : '',
            BackBar3: typeof competencies.BackBar3 === 'string' ? competencies.BackBar3 : '',
            BackBar4: typeof competencies.BackBar4 === 'string' ? competencies.BackBar4 : '',
            BackBar5: typeof competencies.BackBar5 === 'string' ? competencies.BackBar5 : '',
            BackBarUlt: typeof competencies.BackBarUlt === 'string' ? competencies.BackBarUlt : '',
          },
          championPoints: {
            Blue1: typeof championPoints.Blue1 === 'string' ? championPoints.Blue1 as ChampionPointName | '' : '',
            Blue2: typeof championPoints.Blue2 === 'string' ? championPoints.Blue2 as ChampionPointName | '' : '',
            Blue3: typeof championPoints.Blue3 === 'string' ? championPoints.Blue3 as ChampionPointName | '' : '',
            Blue4: typeof championPoints.Blue4 === 'string' ? championPoints.Blue4 as ChampionPointName | '' : '',
            Red1: typeof championPoints.Red1 === 'string' ? championPoints.Red1 as ChampionPointName | '' : '',
            Red2: typeof championPoints.Red2 === 'string' ? championPoints.Red2 as ChampionPointName | '' : '',
            Red3: typeof championPoints.Red3 === 'string' ? championPoints.Red3 as ChampionPointName | '' : '',
            Red4: typeof championPoints.Red4 === 'string' ? championPoints.Red4 as ChampionPointName | '' : '',
            Green1: typeof championPoints.Green1 === 'string' ? championPoints.Green1 as ChampionPointName | '' : '',
            Green2: typeof championPoints.Green2 === 'string' ? championPoints.Green2 as ChampionPointName | '' : '',
            Green3: typeof championPoints.Green3 === 'string' ? championPoints.Green3 as ChampionPointName | '' : '',
            Green4: typeof championPoints.Green4 === 'string' ? championPoints.Green4 as ChampionPointName | '' : '',
          },
          food: typeof entryRecord.food === 'string' ? entryRecord.food : '',
          potion: typeof entryRecord.potion === 'string' ? entryRecord.potion : '',
        };
      }),
    };
  });

  return {
    version: Number(source.version ?? 1),
    raid: {
      groupName: typeof raidSource.groupName === 'string' ? raidSource.groupName : base.raid.groupName,
      selectedRaid: typeof raidSource.selectedRaid === 'string' || raidSource.selectedRaid === null ? raidSource.selectedRaid : base.raid.selectedRaid,
      players,
    },
    fights: fightsNormalized,
  };
}

export function parseTemplateDocument(input: string | unknown): RaidTemplateDocument {
  const parsed = typeof input === 'string' ? JSON.parse(input) : input;
  return normalizeTemplateDocument(parsed);
}

export function exportTemplateDocument(template: RaidTemplateDocument): string {
  return JSON.stringify(normalizeTemplateDocument(template), null, 2);
}

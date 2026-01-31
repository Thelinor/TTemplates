import { CommonSkillLine, ClassSkillLine } from './raidTemplate';
import { ESO_SKILLS } from './esoSkills';
import type { SkillAbility } from './raidTemplate';

export type AbilityCategory = CommonSkillLine | ClassSkillLine;

const skillLines = ESO_SKILLS.reduce<Record<string, string[]>>((acc, skill) => {
  const list = acc[skill.skillLine] ?? [];
  list.push(skill.skillName);
  acc[skill.skillLine] = list;
  return acc;
}, {});

const allSkillLineCategories = [
  ...Object.values(CommonSkillLine),
  ...Object.values(ClassSkillLine),
].filter((line): line is string => Boolean(line) && line !== CommonSkillLine.Empty && line !== ClassSkillLine.Empty);

export const abilityCategories: Record<AbilityCategory, string[]> = Object.fromEntries(
  allSkillLineCategories.map((line) => [line, [...(skillLines[line] ?? [])]]),
) as Record<AbilityCategory, string[]>;

export type AbilitySkillTree = {
  parent: SkillAbility;
  morphs: SkillAbility[];
};

export function getAbilitySkillTree(category: AbilityCategory, ultimateOnly = false): AbilitySkillTree[] {
  const skills = ESO_SKILLS.filter((skill) => (
    skill.skillLine === category && (!ultimateOnly || skill.isUltimate)
  ));
  const skillsByName = new Map(skills.map((skill) => [skill.skillName, skill]));
  const morphsByParent = new Map<string, SkillAbility[]>();

  skills.forEach((skill) => {
    if (!skill.parentSkillName || !skillsByName.has(skill.parentSkillName)) return;
    const morphs = morphsByParent.get(skill.parentSkillName) ?? [];
    morphs.push(skill);
    morphsByParent.set(skill.parentSkillName, morphs);
  });

  return skills
    .filter((skill) => !skill.parentSkillName || !skillsByName.has(skill.parentSkillName))
    .map((parent) => ({ parent, morphs: morphsByParent.get(parent.skillName) ?? [] }));
}

const lineSlugs: Record<string, string> = {
  [CommonSkillLine.FightersGuild]: 'guild/fighters-guild',
  [CommonSkillLine.MagesGuild]: 'guild/mages-guild',
  [CommonSkillLine.Undaunted]: 'guild/undaunted',
  [CommonSkillLine.PsijicOrder]: 'guild/psijic-order',
  [CommonSkillLine.Vampire]: 'world/vampire',
  [CommonSkillLine.Werewolf]: 'world/werewolf',
  [CommonSkillLine.OneHanded]: 'weapon/one-hand-and-shield',
  [CommonSkillLine.TwoHanded]: 'weapon/two-handed',
  [CommonSkillLine.DualWield]: 'weapon/dual-wield',
  [CommonSkillLine.Bow]: 'weapon/bow',
  [CommonSkillLine.DestructionStaff]: 'weapon/destruction-staff',
  [CommonSkillLine.RestorationStaff]: 'weapon/restoration-staff',
  [CommonSkillLine.SoulMagic]: 'world/soul-magic',
  [CommonSkillLine.Armor]: 'armor',
  [CommonSkillLine.Assault]: 'alliance-war/assault',
  [CommonSkillLine.Support]: 'alliance-war/support',
  [ClassSkillLine.EarthenHeart]: 'dragonknight/earthen-heart',
  [ClassSkillLine.DraconicPower]: 'dragonknight/draconic-power',
  [ClassSkillLine.ArdentFlame]: 'dragonknight/ardent-flame',
  [ClassSkillLine.AedricSpear]: 'templar/aedric-spear',
  [ClassSkillLine.DawnsWrath]: 'templar/dawns-wrath',
  [ClassSkillLine.RestoringLight]: 'templar/restoring-light',
  [ClassSkillLine.DaedricSummoning]: 'sorcerer/daedric-summoning',
  [ClassSkillLine.DarkMagic]: 'sorcerer/dark-magic',
  [ClassSkillLine.StormCalling]: 'sorcerer/storm-calling',
  [ClassSkillLine.Assassination]: 'nightblade/assassination',
  [ClassSkillLine.ShadowyEmbrace]: 'nightblade/shadow',
  [ClassSkillLine.Siphoning]: 'nightblade/siphoning',
  [ClassSkillLine.GreenBalance]: 'warden/green-balance',
  [ClassSkillLine.WintersEmbrace]: 'warden/winters-embrace',
  [ClassSkillLine.AnimalCompanions]: 'warden/animal-companions',
  [ClassSkillLine.GraveLord]: 'necromancer/grave-lord',
  [ClassSkillLine.LivingDeath]: 'necromancer/living-death',
  [ClassSkillLine.BoneTyrant]: 'necromancer/bone-tyrant',
  [ClassSkillLine.CurativeRuneforms]: 'arcanist/curative-runeforms',
  [ClassSkillLine.HeraldOfTheTomes]: 'arcanist/herald-of-the-tome',
  [ClassSkillLine.SoldierOfApocrypha]: 'arcanist/soldier-of-apocrypha',
};

const slugify = (value: string): string => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[\u2019']/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const skillPagePaths = new Map<string, string>();
const armorLineBySkill: Record<string, string> = {
  Unstoppable: 'heavy-armor', 'Immovable': 'heavy-armor', 'Unstoppable Brute': 'heavy-armor', 'Heavy Armor Penalties': 'heavy-armor',
  'Heavy Armor Bonuses': 'heavy-armor', Resolve: 'heavy-armor', Constitution: 'heavy-armor', Juggernaut: 'heavy-armor', Revitalize: 'heavy-armor', 'Rapid Mending': 'heavy-armor',
  Annulment: 'light-armor', 'Dampen Magic': 'light-armor', 'Harness Magicka': 'light-armor', 'Light Armor Bonuses': 'light-armor', 'Light Armor Penalties': 'light-armor',
  Grace: 'light-armor', Evocation: 'light-armor', 'Spell Warding': 'light-armor', Prodigy: 'light-armor', Concentration: 'light-armor',
  Evasion: 'medium-armor', Elude: 'medium-armor', Shuffle: 'medium-armor', 'Medium Armor Bonuses': 'medium-armor', Dexterity: 'medium-armor',
  'Wind Walker': 'medium-armor', 'Improved Sneak': 'medium-armor', Agility: 'medium-armor', Athletics: 'medium-armor',
};

for (const [line, skills] of Object.entries(skillLines)) {
  const lineSlug = lineSlugs[line];
  if (!lineSlug) continue;
  for (const skill of skills) {
    const resolvedLineSlug = line === CommonSkillLine.Armor
      ? `armor/${armorLineBySkill[skill] ?? 'heavy-armor'}`
      : lineSlug;
    skillPagePaths.set(skill, `${resolvedLineSlug}/${slugify(skill)}`);
  }
}

export function getAbilityDisplayName(ability: string): string {
  return ability;
}

export function getAbilityPageUrl(ability: string): string | null {
  const path = skillPagePaths.get(ability);
  return path ? `https://eso-hub.com/en/skills/${path}` : null;
}

export function getEsoHubImagePath(pageUrl: string): string {
  return `/api/eso-hub-skill-icon?url=${encodeURIComponent(pageUrl)}`;
}

export function getAbilityImagePath(_category: AbilityCategory, ability: string): string {
  const pageUrl = getAbilityPageUrl(ability);
  return pageUrl ? getEsoHubImagePath(pageUrl) : '';
}

export function getAllAbilityCategories(): AbilityCategory[] {
  return Object.keys(abilityCategories) as AbilityCategory[];
}
const commonSkillLines = new Set<string>(Object.values(CommonSkillLine).filter(Boolean));

export function getAbilityCategoriesForSkillLines(skillLines: readonly string[]): AbilityCategory[] {
  const selectedClassLines = new Set(
    skillLines.filter((line) => Boolean(line) && !commonSkillLines.has(line)),
  );

  return getAllAbilityCategories().filter((category) => {
    return commonSkillLines.has(category) || selectedClassLines.has(category);
  });
}

import { getAbilityImagePath, getEsoHubImagePath } from './abilityCategories';
import { ESO_FOODS } from './esoFoods';
import { ESO_POTIONS } from './esoPotions';
import { ClassSkillLine } from './raidTemplate';

const foodDetailUrlByName: Record<string, string> = {
  'Artaeum Pickled Fish Bowl': 'https://eso-hub.com/en/food-drinks/delicacies/artaeum-pickled-fish-bowl',
};

const foodSearchUrl = (foodName: string) => `https://eso-hub.com/en/food-drinks?search=${encodeURIComponent(foodName)}`;
const foodPageUrl = (foodName: string) => foodDetailUrlByName[foodName] ?? foodSearchUrl(foodName);

export const FOOD_ICON_MAP: Record<string, string> = Object.fromEntries(
  ESO_FOODS.map((food) => [food.name, getEsoHubImagePath(foodPageUrl(food.name))]),
);

const potionIconByName: Record<string, string> = {
  'Spell Power': '/potions/consumable_potion_001_type_005.png',
  'Stamina': '/potions/consumable_potion_001_type_005.png',
  'Health': '/potions/consumable_potion_002_type_005.png',
  'Magicka': '/potions/consumable_potion_002_type_005.png',
  'Tri-Stat': '/potions/consumable_potion_001_type_005.png',
};

export const POTION_ICON_MAP: Record<string, string> = Object.fromEntries(
  ESO_POTIONS.map((potion) => [potion.name, potionIconByName[potion.name] ?? '']),
);
export const DEFAULT_FOOD_ICON = '';
export const DEFAULT_POTION_ICON = '';

export const ROLE_ICON_MAP: Record<string, string> = {
  Tank: '/roles/ESO_Tank.png',
  Heal: '/roles/ESO_Heal.png',
  DPS: '/roles/ESO_DPS.png',
};

const ESO_HUB_CLASS_ICON_BASE = 'https://eso-hub.com/storage/icons/class/gamepad';
export const CLASS_ICON_MAP: Record<string, string> = {
  Templar: `${ESO_HUB_CLASS_ICON_BASE}/gp_class_templar.png`,
  Sorcerer: `${ESO_HUB_CLASS_ICON_BASE}/gp_class_sorcerer.png`,
  Nightblade: `${ESO_HUB_CLASS_ICON_BASE}/gp_class_nightblade.png`,
  Dragonknight: `${ESO_HUB_CLASS_ICON_BASE}/gp_class_dragonknight.png`,
  Warden: `${ESO_HUB_CLASS_ICON_BASE}/gp_class_warden.png`,
  Necromancer: `${ESO_HUB_CLASS_ICON_BASE}/gp_class_necromancer.png`,
  Arcanist: `${ESO_HUB_CLASS_ICON_BASE}/gp_class_arcanist.png`,
};

const skillLineImage = (category: Parameters<typeof getAbilityImagePath>[0], skill: string) => (
  getAbilityImagePath(category, skill)
);

// These are the same representative skills used by the previous local mapping.
export const SKILL_LINE_ICON_MAP: Record<string, string> = {
  [ClassSkillLine.EarthenHeart]: skillLineImage(ClassSkillLine.EarthenHeart, 'Volcanic Ward'),
  [ClassSkillLine.DraconicPower]: skillLineImage(ClassSkillLine.DraconicPower, 'Fleetstep Wings'),
  [ClassSkillLine.ArdentFlame]: skillLineImage(ClassSkillLine.ArdentFlame, 'Flame Lash'),
  [ClassSkillLine.AedricSpear]: skillLineImage(ClassSkillLine.AedricSpear, 'Radiant Ward'),
  [ClassSkillLine.DawnsWrath]: skillLineImage(ClassSkillLine.DawnsWrath, 'Power of the Light'),
  [ClassSkillLine.RestoringLight]: skillLineImage(ClassSkillLine.RestoringLight, 'Breath of Life'),
  [ClassSkillLine.DaedricSummoning]: skillLineImage(ClassSkillLine.DaedricSummoning, 'Daedric Prey'),
  [ClassSkillLine.DarkMagic]: skillLineImage(ClassSkillLine.DarkMagic, 'Crystal Shard'),
  [ClassSkillLine.StormCalling]: skillLineImage(ClassSkillLine.StormCalling, 'Expert Mage'),
  [ClassSkillLine.Assassination]: skillLineImage(ClassSkillLine.Assassination, 'Lotus Fan'),
  [ClassSkillLine.ShadowyEmbrace]: skillLineImage(ClassSkillLine.ShadowyEmbrace, 'Dark Cloak'),
  [ClassSkillLine.Siphoning]: skillLineImage(ClassSkillLine.Siphoning, 'Crippling Grasp'),
  [ClassSkillLine.GreenBalance]: skillLineImage(ClassSkillLine.GreenBalance, 'Living Trellis'),
  [ClassSkillLine.WintersEmbrace]: skillLineImage(ClassSkillLine.WintersEmbrace, 'Crystallized Shield'),
  [ClassSkillLine.AnimalCompanions]: skillLineImage(ClassSkillLine.AnimalCompanions, 'Growing Swarm'),
  [ClassSkillLine.GraveLord]: skillLineImage(ClassSkillLine.GraveLord, 'Blighted Blastbones'),
  [ClassSkillLine.LivingDeath]: skillLineImage(ClassSkillLine.LivingDeath, 'Blood Sacrifice'),
  [ClassSkillLine.BoneTyrant]: skillLineImage(ClassSkillLine.BoneTyrant, 'Beckoning Armor'),
  [ClassSkillLine.CurativeRuneforms]: skillLineImage(ClassSkillLine.CurativeRuneforms, 'Audacious Runemend'),
  [ClassSkillLine.HeraldOfTheTomes]: skillLineImage(ClassSkillLine.HeraldOfTheTomes, "Cephaliarch's Flail"),
  [ClassSkillLine.SoldierOfApocrypha]: skillLineImage(ClassSkillLine.SoldierOfApocrypha, 'Cruxweaver Armor'),
};

const mundusSlugs: Record<string, string> = {
  'The Apprentice': 'the-apprentice',
  'The Atronach': 'the-atronach',
  'The Lady': 'the-lady',
  'The Lord': 'the-lord',
  'The Lover': 'the-lover',
  'The Mage': 'the-mage',
  'The Ritual': 'the-ritual',
  'The Serpent': 'the-serpent',
  'The Shadow': 'the-shadow',
  'The Steed': 'the-steed',
  'The Thief': 'the-thief',
  'The Tower': 'the-tower',
  'The Warrior': 'the-warrior',
};

export const MUNDUS_ICON_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(mundusSlugs).map(([name, slug]) => [
    name,
    getEsoHubImagePath(`https://eso-hub.com/en/mundus-stones/${slug}`),
  ]),
);

export const ICON_MAP = SKILL_LINE_ICON_MAP;

// Cartographie centralisée des icônes utilisées dans l'application.
// But: factoriser les maps pour éviter les duplications entre pages.

export const FOOD_ICON_MAP: { [key: string]: string } = {
  Bastion: '/spliticons/store_tricolor_food_01.png',
  Tripe: '/spliticons/ability/provisioner/001.png',
  Mushroom: '/spliticons/ability/provisioner/002.png',
  Grapes: '/spliticons/ability/provisioner/003.png',
  Lobster: '/spliticons/ability/provisioner/004.png',
  Rice: '/spliticons/ability/provisioner/005.png',
};

export const POTION_ICON_MAP: { [key: string]: string } = {
  'Spell Power': '/spliticons/ability/provisioner/006.png',
  Stamina: '/spliticons/ability/provisioner/007.png',
  Health: '/spliticons/ability/provisioner/008.png',
  Magicka: '/spliticons/ability/skeevatonrestore.png',
  'Tri-Stat': '/spliticons/store_tricolor_food_01.png',
};

export const DEFAULT_FOOD_ICON = '/spliticons/store_tricolor_food_01.png';
export const DEFAULT_POTION_ICON = '/spliticons/ability/skeevatonrestore.png';

export const ROLE_ICON_MAP: { [key: string]: string } = {
  Tank: '/spliticons/lfg/lfg_tank_down_no_glow_64.png',
  Heal: '/spliticons/lfg/lfg_healer_down_no_glow_64.png',
  DPS: '/spliticons/lfg/lfg_dps_down_no_glow_64.png',
};

export const CLASS_ICON_MAP: { [key: string]: string } = {
  Templar: '/spliticons/class/gp_class_templar.png',
  Sorcerer: '/spliticons/class/gp_class_sorcerer.png',
  Nightblade: '/spliticons/class/gp_class_nightblade.png',
  Dragonknight: '/spliticons/class/gp_class_dragonknight.png',
  Warden: '/spliticons/class/gp_class_warden.png',
  Necromancer: '/spliticons/class/gp_class_necromancer.png',
  Arcanist: '/spliticons/class/gp_class_arcanist.png',
};

export const SKILL_LINE_ICON_MAP: { [key: string]: string } = {
  'Earthen Heart': '/spliticons/ability/dragonknight/013_a.png',
  'Draconic Power': '/spliticons/ability/dragonknight/007_b.png',
  'Ardent Flame': '/spliticons/ability/dragonknight/001_b.png',
  'Aedric Spear': '/spliticons/ability/templar/radiant_ward.png',
  "Dawn's Wrath": '/spliticons/ability/templar/power_of_the_light.png',
  "Purifying Light": '/spliticons/ability/templar/breath_of_life.png',
  'Daedric Summoning': '/spliticons/ability/sorcerer/explosive_curse.png',
  'Dark Magic': '/spliticons/ability/sorcerer/thunderstomp.png',
  'Storm Calling': '/spliticons/ability/sorcerer/thundering_presence.png',
  'Assassination': '/spliticons/ability/nightblade/007_a.png',
  'Shadowy Embrace': '/spliticons/ability/nightblade/001_a.png',
  'Siphoning': '/spliticons/ability/nightblade/003_b.png',
  'Green Balance': '/spliticons/ability/warden/008.png',
  "Winter's Embrace": '/spliticons/ability/warden/002.png',
  'Animal Companions': '/spliticons/ability/warden/015_b.png',
  'Grave Lord': '/spliticons/ability/necromancer/001_a.png',
  'Living Death': '/spliticons/ability/necromancer/013_a.png',
  "Bone Tyrant": '/spliticons/ability/necromancer/008_b.png',
  "Curative Runeforms": '/spliticons/ability/arcanist/013.png',
  "Herald of the Tomes": '/spliticons/ability/arcanist/002_b.png',
  "Soldier of Apocrypha": '/spliticons/ability/arcanist/012.png',
  // Additional skills referenced in PlayerCard
  'Heroic Slash': '/spliticons/ability/1handed/001.png',
  'Pierce Armor': '/spliticons/ability/1handed/002_b.png',
  'Igneous Shield': '/spliticons/ability/dragonknight/013_a.png',
  'Chains': '/spliticons/ability/dragonknight/005_a.png',
  'Ardent Flame_alt': '/spliticons/ability/nightblade/003_b.png',
};

// Map plus générique pour les icônes d'aptitudes/classes utilisée par PlayerCard
export const ICON_MAP: { [key: string]: string } = {
  Assassination: '/spliticons/ability/nightblade/007.png',
  'Ardent Flame': '/spliticons/ability/nightblade/003_b.png',
  'Earthen Heart': '/spliticons/ability/nightblade/013_b.png',
  'Heroic Slash': '/spliticons/ability/1handed/001.png',
  'Pierce Armor': '/spliticons/ability/1handed/002_b.png',
  'Igneous Shield': '/spliticons/ability/dragonknight/013_a.png',
  Chains: '/spliticons/ability/dragonknight/005_a.png',
};

const ICONS = {
  ROLE_ICON_MAP,
  CLASS_ICON_MAP,
  SKILL_LINE_ICON_MAP,
  ICON_MAP,
};

export default ICONS;

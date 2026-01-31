/**
 * This file contains the mapping of ability categories to their available abilities.
 * The categories are derived from the folder structure in public/spliticons/ability/
 * Each category maps to a list of ability image filenames (without .png extension)
 */

export type AbilityCategory = 
  | '1handed'
  | '2handed'
  | 'arcanist'
  | 'armor'
  | 'ava'
  | 'bow'
  | 'destructionstaff'
  | 'dragonknight'
  | 'dualwield'
  | 'fightersguild'
  | 'grimoire'
  | 'healer'
  | 'mageguild'
  | 'necromancer'
  | 'nightblade'
  | 'otherclass'
  | 'psijic'
  | 'restorationstaff'
  | 'scrying'
  | 'sorcerer'
  | 'soulmagic'
  | 'templar'
  | 'undaunted'
  | 'vampire'
  | 'warden'
  | 'weapon'
  | 'werewolf'


// Dynamically generated mapping - in production, this would be generated from the actual file system
// For now, we'll create a helper function that can fetch the list dynamically
export const abilityCategories: Record<AbilityCategory, string[]> = {
  '1handed': ['001', '001_a', '001_b', '001_orange', '001_red', '002', '002_a', '002_b', '002_lava', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b', '006', '006_a', '006_b'],
  '2handed': ['001', '001_a', '001_b', '002', '002_a', '002_b', '002_blue', '002_red', '003', '003_a', '003_b', '003_ice', '004', '004_a', '004_b', '004_red', '005', '005_a', '005_b', '005_yellow', '006', '006_a', '006_b'],
  'arcanist': ['001', '001_a', '001_b', '001_blue', '002', '002_a', '002_b', '002_blue', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b', '006', '006_a', '006_b', '007', '007_a', '007_b', '008', '008_a', '008_b', '009', '009_a', '009_b', '010', '010_a', '010_b', '011', '011_a', '011_b', '012', '012_a', '012_b', '013', '013_a', '013_b', '013_blue', '014', '014_a', '014_b', '015', '015_a', '015_b', '016', '016_a', '016_b', '017', '017_a', '017_b', '018', '018_a', '018_b'],
  'armor': ['001', '001_a', '001_b', '002', '002_a', '002_b', '003', '003_a', '003_b', '003_yellow', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015'],
  'ava': ['001', '001_a', '001_b', '002', '002_a', '002_b', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b'],
  'bow': ['001', '001_a', '001_b', '001_red', '001_yellow', '002', '002_a', '002_b', '002_red', '003', '003_a', '003_b', '003_ice', '004', '004_a', '004_b', '005', '005_a', '005_b', '006', '006_a', '006_b'],
  'destructionstaff': ['001', '001_blackcore', '001_bluewhite', '001a', '001b', '002', '002_floral', '002_green', '002_purple', '002a', '002b', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b', '006', '006_a', '006_b', '007', '007_a', '007_b', '008', '008_a', '008_b', '009', '009_a', '009_b', '010', '010_a', '010_b', '011', '011_purple', '011a', '011b', '012', '012_a', '012_b', '012_purple', '013', '013_a', '013_b', '014', '014_a', '014_b', '015', '015_a', '015_b'],
  'dragonknight': ['001', '001_a', '001_b', '001_blue', '002', '002_a', '002_b', '003', '003_a', '003_b', '004', '004_a', '004_b', '004_blue', '005', '005_a', '005_b', '006', '006_a', '006_b', '007', '007_a', '007_b', '007_blue', '008', '008_a', '008_b', '009', '009_a', '009_b', '010', '010_a', '010_b', '011', '011_a', '011_b', '012', '012_a', '012_b', '013', '013_a', '013_b', '014', '014_a', '014b', '015', '015_a', '015_b', '016', '016a', '016b', '017', '017a', '017b', '018', '018_a', '018_b', '020', '021', '023', '024', '025', '028', '029', '031', '032', '034'],
  'dualwield': ['001', '001_a', '001_b', '001_purple', '002', '002_a', '002_b', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b', '005_orange', '005_red', '006', '006_a', '006_b', 'deadlycloak'],
  'fightersguild': ['001', '001_a', '001_b', '002', '002_a', '002_b', '002_red', '003', '003_a', '003_b', '003_gold', '004', '004_a', '004_b', '004_orange', '005', '005_a', '005_b', '005_darkpurple', '005_yellow', 'passive_intimidate'],
  'grimoire': ['1handed', '2handed', 'assault', 'bow', 'dualwield', 'fightersguild', 'magesguild', 'soulmagic1', 'soulmagic2', 'staffdestro', 'staffresto', 'support'],
  'healer': ['002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027', '028', '029', '030', '031', '032', '033', '034', '035'],
  'mageguild': ['001', '001_a', '001_b', '002', '002_a', '002_b', '002_floral', '002_green', '003', '003_a', '003_b', '004', '004_a', '004_b', '004_purple', '004_yellow', '005', '005_a', '005_b', '005_ice', '005_orange'],
  'necromancer': ['001', '001_a', '001_b', '001_red', '002', '002_a', '002_a_blackedout', '002_b', '002_b_blackedout', '002_blackedout', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b', '006', '006_a', '006_b', '006_red', '007', '007_a', '007_b', '007_red', '008', '008_a', '008_b', '009', '009_a', '009_b', '010', '010_a', '010_b', '011', '011_a', '011_b', '012', '012_a', '012_b', '013', '013_a', '013_b', '014', '014_a', '014_b', '015', '015_a', '015_b', '016', '016_a', '016_b', '017', '017_a', '017_b', '018', '018_a', '018_b'],
  'nightblade': ['001', '001_a', '001_b', '002', '002_a', '002_b', '002_purple', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b', '006', '006_a', '006_b', '007', '007_a', '007_b', '007_c', '007_purple', '008', '008_a', '008_b', '009', '009_a', '009_b', '010', '010_a', '010_b', '011', '011_a', '011_b', '012', '012_a', '012_b', '013', '013_a', '013_b', '014', '014_a', '014_b', '015', '015_a', '015_b', '016', '016_a', '016_b', '017', '017_a', '017_b', '017_purple', '018', '018_a', '018_b', 'assassinswill'],
  'otherclass': ['001', '001_a', '001_b', '002', '002_a', '002_b'],
  'psijic': ['001', '001_a', '001_b', '001_purple', '002', '002_a', '002_b', '003', '003_a', '003_b', '004', '004_a', '004_b', '005', '005_a', '005_b', '005_purple', '006', '006_a', '006_b', '007', '008', '009', '010', '011'],
  'restorationstaff': ['001', '001_a', '001_b', '002', '002_blue', '002_purple', '002a', '002b', '003', '003_a', '003_b', '003_blue', '004', '004_purple', '004_water', '004a', '004b', '005', '005_a', '005_b', '006', '006_a', '006_b'],
  'scrying': ['01', '02', '03', '04', '05a', '05b', '05c', '05d', '05e', '06a', '06b', '07a', '07b', '07c', '08a', '08b', '09'],
  'sorcerer': ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027', '028', '029', '030', '036', '037', '038', '039', '041', '043', '044', '045', '047', '049', '054', '056', '057', '059', '060', '062', '063', '065', '067', '068', '070', 'ball_of_lightning', 'bolt_escape', 'bound_aegis', 'bound_armaments', 'bound_armaments_proc', 'bound_armor', 'boundless_storm', 'critical_surge', 'crushing_monsoon', 'crushing_winds', 'crystalweapon', 'cyclone', 'daedric_curse', 'daedric_curse_red', 'daedric_minefield', 'daedric_mines', 'daedric_tomb', 'dark_conversion', 'dark_deal', 'dark_exchange', 'dark_fog', 'dark_haze', 'endless_atronachs', 'endless_fury', 'energy_overload', 'explosive_curse', 'greater_storm_atronach', 'hurricane', 'lightning_flood', 'lightning_form', 'lightning_form_red', 'lightning_matriarch', 'lightning_matriarch_summoned', 'lightning_prey', 'lightning_prey_redcelestial', 'lightning_prey_summoned', 'lightning_splash', 'liquid_lightning', 'mage_fury', 'mage_wraith', 'monsoon', 'overload', 'power_overload', 'power_surge', 'rushing_winds', 'speedy_familiar', 'speedy_familiar_summoned', 'storm_atronach', 'storm_prey', 'storm_prey_summoned', 'streak', 'surge', 'tempest', 'thunder_burst', 'thunderclap', 'thunderclap_red', 'thundering_presence', 'thunderstomp', 'thunderstomp_proc', 'twister', 'typhoon', 'unstable_clannfear', 'unstable_clannfear_summoned', 'unstable_fimiliar', 'unstable_fimiliar_summoned', 'velocious_curse', 'weakening_fog'],
  'soulmagic': ['001_purple', '001_red'],
  'templar': ['002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027', '028', '029', '030', '031', '032', 'backlash', 'backlash_blue', 'blazing_shield', 'breath_of_life', 'channeled_focus', 'cleansing_ritual', 'crescent_sweep', 'dark_flare', 'double_tipped_charge', 'eclipse', 'empowering_sweep', 'extended_ritual', 'focused_charge', 'healing_ritual', 'honor_the_dead', 'life_giving_sigil', 'light_spear', 'light_strike', 'lingering_ritual', 'nova', 'over_exposure', 'persistant_sigil', 'power_of_the_light', 'practiced_incantation', 'purifying_light', 'purifying_ritual', 'radial_sweep', 'radiant_ward', 'reckless_attacks', 'recovery', 'reflective_light', 'remembrance', 'restoring_sigil', 'returning_spear', 'ripping_spear', 'rite_of_passage', 'ritual_of_rebirth', 'rune_focus', 'rushed_ceremony', 'rushed_ceremony_blue', 'solar_disturbance', 'solar_flare', 'solar_power', 'solar_prison', 'stendarr_aura', 'sun_fire', 'sun_shield', 'sun_strike', 'toppling_charge', 'total_dark', 'trained_attacker', 'trained_attacker_blue', 'under_exposure', 'uninterrupted_focus', 'unstable_core', 'vampire_bane'],
  'undaunted': ['001', '001_a', '001_b', '002', '002_a', '002_b', '003', '003_a', '003_b', '004', '004_a', '004b', '005', '005a', '005b'],
  'vampire': ['001', '001_a', '001_b', '001_c', '002', '002_a', '002_b', '003', '003_a', '003_b', '004', '005', '006', '007', '008', '009', '010'],
  'warden': ['001', '001_a', '001_b', '002', '002_a', '002_b', '003', '003_a', '003_b', '003_orange', '004', '004_a', '004_b', '005', '005_a', '005_b', '006', '006_a', '006_b', '007', '007_a', '007_b', '007_c', '008', '008_a', '008_b', '008_orange', '009', '009_a', '009_b', '010', '010_a', '010_b', '011', '011_a', '011_b', '012', '012_a', '012_b', '013', '013_a', '013_b', '014', '014_a', '014_b', '015', '015_a', '015_b', '015_orange', '016', '016_a', '016_b', '017', '017_a', '017_b', '018', '018_a', '018_b', '018_c', '018_grey'],
  'weapon': ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '021', '022', '023', '024', '025', '026', '027', '028', '029', '030'],
  'werewolf': ['001', '001_a', '001_b', '002', '002_a', '002_b', '002_rend', '002_rend_a', '002_rend_b', '003', '003_a', '003_b', '003_green', '004', '004_a', '004_b', '004_c', '005', '005_a', '005_b', '005_c', '006', '006_a', '006_b', '006_c', '007', '008', '009', '010'],
};

/**
 * Maps ability filenames to display names for UI
 */
const abilityDisplayNames: Record<string, string> = {
  // Artifact
  'volendrung_001': 'Volendrung I',
  'volendrung_002': 'Volendrung II',
  'volendrung_003': 'Volendrung III',
  'volendrung_004': 'Volendrung IV',
  'volendrung_005': 'Volendrung V',
  'volendrung_006': 'Volendrung VI',
  // Buff/Debuff - Format underscores nicely
  // Companion abilities
  'arcanist_abyssalimpact': 'Abyssal Impact',
  'arcanist_domain': 'Domain',
  'arcanist_fatewovenarmor': 'Fatewoven Armor',
  'arcanist_passive': 'Passive',
  'arcanist_runeblades': 'Rune Blades',
  'arcanist_runemend': 'Rune Mend',
  'arcanist_runeofeldritchhorror': 'Rune of Eldritch Horror',
  'arcanist_runicjab': 'Runic Jab',
  'arcanist_tidalshield': 'Tidal Shield',
  'arcanist_tomebearersinspiration': 'Tome Bearer\'s Inspiration',
  'arcanist_vigoroustentaculareruption': 'Vigorous Tentacular Eruption',
  'armor_heavy': 'Heavy Armor',
  'armor_light': 'Light Armor',
  'armor_medium': 'Medium Armor',
  'dragonknight_hazeofcinders': 'Haze of Cinders',
  'dragonknight_volcanicarms': 'Volcanic Arms',
  'necromancer_bonetotem': 'Bone Totem',
  'necromancer_boneyard': 'Boneyard',
  'necromancer_detonatingsiphon': 'Detonating Siphon',
  'necromancer_flameskull': 'Flame Skull',
  'necromancer_lifeamiddeath': 'Life Amid Death',
  'necromancer_restoringtether': 'Restoring Tether',
  'necromancer_scythe': 'Scythe',
  'nightblade_unique': 'Unique',
  'tanlorin_explosivefortitude': 'Explosive Fortitude',
  'tanlorin_extinguishingbreath': 'Extinguishing Breath',
  'tanlorin_igneousarmor': 'Igneous Armor',
  'tanlorin_internalconflict': 'Internal Conflict',
  'tanlorin_passive': 'Passive',
  'tanlorin_shattersoul': 'Shatter Soul',
  'tanlorin_wavesofpower': 'Waves of Power',
  'templar_baneslayer': 'Bane Slayer',
  'templar_cleansing_ritual': 'Cleansing Ritual',
  'templar_cunning': 'Cunning',
  'templar_focused_charge': 'Focused Charge',
  'templar_over_exposure': 'Over Exposure',
  'templar_purifying_light': 'Purifying Light',
  'templar_returning_spear': 'Returning Spear',
  'templar_rushed_ceremony': 'Rushed Ceremony',
  'templar_sun_fire': 'Sun Fire',
  'templar_sun_shield': 'Sun Shield',
  'templar_trained_attacker': 'Trained Attacker',
  'ultimate_bastian_001': 'Bastian Ultimate',
  'ultimate_mirri_001': 'Mirri Ultimate',
  'warden_arcticwind': 'Arctic Wind',
  'warden_dive': 'Dive',
  'warden_frostcloak': 'Frostcloak',
  'warden_fungalgrowth': 'Fungal Growth',
  'warden_gore': 'Gore',
  'warden_healingseed': 'Healing Seed',
  'warden_impalingshards': 'Impaling Shards',
  'warden_lotusflower': 'Lotus Flower',
  'warden_passive': 'Passive',
  'warden_scorch': 'Scorch',
  'warden_swarm': 'Swarm',
  'zerith_bonearmor': 'Bone Armor',
  'zerith_mendingspirit': 'Mending Spirit',
  'zerith_mooncrescent': 'Moon Crescent',
  'zerith_passive': 'Passive',
  'zerith_renderflesh': 'Render Flesh',
  // Death
  'recap_ithelia_aoe': 'Ithelia AOE',
  'recap_ithelia_aoe2': 'Ithelia AOE 2',
  'recap_ithelia_cone': 'Ithelia Cone',
  'recap_ithelia_dot_base': 'Ithelia DoT Base',
  'recap_ithelia_dot_heavy': 'Ithelia DoT Heavy',
  'recap_ithelia_dot_heavy2': 'Ithelia DoT Heavy 2',
  'recap_ithelia_melee': 'Ithelia Melee',
  'recap_ithelia_ranged': 'Ithelia Ranged',
  'recap_ithelia_ranged2': 'Ithelia Ranged 2',
  'recap_ithelia_ranged_arrow': 'Ithelia Ranged Arrow',
  'recap_ithelia_trap': 'Ithelia Trap',
  'recap_melee_axe_basic': 'Melee Axe Basic',
  'recap_melee_axe_heavy': 'Melee Axe Heavy',
  'recap_melee_dagger_basic': 'Melee Dagger Basic',
  'recap_melee_dagger_heavy': 'Melee Dagger Heavy',
  'recap_melee_mace_basic': 'Melee Mace Basic',
  'recap_melee_mace_heavy': 'Melee Mace Heavy',
  'recap_monster_tail_base': 'Monster Tail Base',
  'recap_monster_tail_heavy': 'Monster Tail Heavy',
  'recap_shock_chainlightning': 'Shock Chain Lightning',
  'recap_trauma': 'Trauma',
  // U Updates
  'bloodball_chokeonit': 'Choke on It',
  'dragonmaskelsweyr': 'Dragon Mask Elsweyr',
  'drg_blizzard': 'Blizzard',
  'drg_breath_flame': 'Breath Flame',
  'drg_breath_frost': 'Breath Frost',
  'drg_breath_storm': 'Breath Storm',
  'drg_earthspike': 'Earth Spike',
  'drg_meteorstorm': 'Meteor Storm',
  'drg_soultear': 'Soul Tear',
  'drg_stormcall': 'Storm Call',
  'drg_tailswipe': 'Tail Swipe',
  'drg_takeoffland': 'Take Off/Land',
  'drg_timestop': 'Time Stop',
  'drg_unrelentingforce': 'Unrelenting Force',
  'drg_wingthrash': 'Wing Thrash',
  'dun_buff_abominablebulwark': 'Abominable Bulwark',
  'dun_buff_forgottenstrength': 'Forgotten Strength',
  'dun_buff_voirasauthority': 'Voira\'s Authority',
  'vampire_01': 'Vampire 1',
  'vampire_01_a': 'Vampire 1 A',
  'vampire_01_b': 'Vampire 1 B',
  'vampire_02': 'Vampire 2',
  'vampire_02_a': 'Vampire 2 A',
  'vampire_02_b': 'Vampire 2 B',
  'vampire_03': 'Vampire 3',
  'vampire_03_a': 'Vampire 3 A',
  'vampire_03_b': 'Vampire 3 B',
  'vampire_04': 'Vampire 4',
  'vampire_04_a': 'Vampire 4 A',
  'vampire_04_b': 'Vampire 4 B',
  'vampire_05': 'Vampire 5',
  'vampire_05_a': 'Vampire 5 A',
  'vampire_05_b': 'Vampire 5 B',
  'vampire_06': 'Vampire 6',
  'vampire_06_a': 'Vampire 6 A',
  'vampire_06_b': 'Vampire 6 B',
  'vampire_infection_stage0': 'Infection Stage 0',
  'vampire_infection_stage1': 'Infection Stage 1',
  'vampire_infection_stage2': 'Infection Stage 2',
  'vampire_infection_stage3': 'Infection Stage 3',
  'vampire_infection_stage4': 'Infection Stage 4',
  'vampire_infection_stage5': 'Infection Stage 5',
  'vampire_synergy_feed': 'Synergy Feed',
  'behemothbitterboom': 'Bitter Boom',
  'behemothbonecrusher': 'Bone Crusher',
  'behemothmutilate': 'Mutilate',
  'behemothrallyingroar1': 'Rallying Roar 1',
  'behemothrallyingroar2': 'Rallying Roar 2',
  'behemothrampage': 'Rampage',
  'behemothswipe': 'Swipe',
  'behemothtremor': 'Tremor',
  'behemothviciousgnaw': 'Vicious Gnaw',
  'bestialannihilation1': 'Bestial Annihilation 1',
  'bestialannihilation2': 'Bestial Annihilation 2',
  'stonegardenbulwark': 'Stone Garden Bulwark',
  'stonegardenenhancedbulwark': 'Stone Garden Enhanced Bulwark',
  'stonegardenenhancedrecovery': 'Stone Garden Enhanced Recovery',
  'stonegardenenhancedstrength': 'Stone Garden Enhanced Strength',
  'stonegardenrecovery': 'Stone Garden Recovery',
  'stonegardenstrength': 'Stone Garden Strength',
  'destructive_ember': 'Destructive Ember',
  'destructive_ember_b': 'Destructive Ember B',
  'devitalized': 'Devitalized',
  'evoker_aura': 'Evoker Aura',
  'firebrand': 'Firebrand',
  'frostbrand': 'Frostbrand',
  'huntersmark': 'Hunter\'s Mark',
  'magus_aura': 'Magus Aura',
  'parasite': 'Parasite',
  'piercing_hailstone': 'Piercing Hailstone',
  'piercing_hailstone_b': 'Piercing Hailstone B',
  'pirates_dice': 'Pirate\'s Dice',
  'pirates_treasure': 'Pirate\'s Treasure',
  'rattled': 'Rattled',
  'sea_witch_mindcontrol': 'Sea Witch Mind Control',
  'seethe': 'Seethe',
  'shaman_aura': 'Shaman Aura',
  'whirlpool': 'Whirlpool',
  'tri_arcane_knot': 'Arcane Knot',
  'tri_arcane_knot_claim': 'Arcane Knot Claim',
  'tri_arcane_knot_fracture': 'Arcane Knot Fracture',
  'tri_arcane_knot_synergy': 'Arcane Knot Synergy',
  'tri_arcane_knot_wound': 'Arcane Knot Wound',
  'tri_b2_annihilation': 'B2 Annihilation',
  'tri_b2_dark_godfinger': 'B2 Dark Godfinger',
  'tri_b2_dark_protection': 'B2 Dark Protection',
  'tri_b2_light_godfinger': 'B2 Light Godfinger',
  'tri_b2_light_protection': 'B2 Light Protection',
  'tri_fluctuating_current': 'Fluctuating Current',
  'tri_ghostlite': 'Ghostlite',
  'tri_mirror_realm': 'Mirror Realm',
  'tri_pillar_eruption': 'Pillar Eruption',
  'tri_tempest_assault': 'Tempest Assault',
  'death_recap_blueclaw': 'Blue Claw',
  'death_recap_greenclaw': 'Green Claw',
  'dun1_b2_blackspinecurse': 'Black Spine Curse',
  'dun1_b2_ironimpact': 'Iron Impact',
  'dun1_b2_ironwake': 'Iron Wake',
  'dun1_b2_shockspear': 'Shock Spear',
  'dun1_b3_fireeffect': 'Fire Effect',
  'dun1_b3_fireorb_syn': 'Fire Orb Synergy',
  'dun1_b3_iceeffect': 'Ice Effect',
  'dun1_b3_iceorb_syn': 'Ice Orb Synergy',
  'dun1_b3_shockeffect': 'Shock Effect',
  'dun1_b3_shockorb_syn': 'Shock Orb Synergy',
  'dun1_secret_buff_1': 'Secret Buff 1',
  'dun1_secret_buff_2': 'Secret Buff 2',
  'dun1_secret_buff_3': 'Secret Buff 3',
  'dun2_b1_noxiousboulder': 'Noxious Boulder',
  'dun2_b1_reveal': 'Reveal',
  'dun2_b1_ricochet': 'Ricochet',
  'dun2_b1_venomeruption': 'Venom Eruption',
  'dun2_b2_bluewhirlwind': 'Blue Whirlwind',
  'dun2_b3_confine': 'Confine',
  'dun2_b3_slowdescent': 'Slow Descent',
  // Sorcerer special abilities
  'ball_of_lightning': 'Ball of Lightning',
  'bolt_escape': 'Bolt Escape',
  'bound_aegis': 'Bound Aegis',
  'bound_armaments': 'Bound Armaments',
  'bound_armaments_proc': 'Bound Armaments Proc',
  'bound_armor': 'Bound Armor',
  'boundless_storm': 'Boundless Storm',
  'critical_surge': 'Critical Surge',
  'crushing_monsoon': 'Crushing Monsoon',
  'crushing_winds': 'Crushing Winds',
  'crystalweapon': 'Crystal Weapon',
  'cyclone': 'Cyclone',
  'daedric_curse': 'Daedric Curse',
  'daedric_curse_red': 'Daedric Curse Red',
  'daedric_minefield': 'Daedric Minefield',
  'daedric_mines': 'Daedric Mines',
  'daedric_tomb': 'Daedric Tomb',
  'dark_conversion': 'Dark Conversion',
  'dark_deal': 'Dark Deal',
  'dark_exchange': 'Dark Exchange',
  'dark_fog': 'Dark Fog',
  'dark_haze': 'Dark Haze',
  'endless_atronachs': 'Endless Atronachs',
  'endless_fury': 'Endless Fury',
  'energy_overload': 'Energy Overload',
  'explosive_curse': 'Explosive Curse',
  'greater_storm_atronach': 'Greater Storm Atronach',
  'hurricane': 'Hurricane',
  'lightning_flood': 'Lightning Flood',
  'lightning_form': 'Lightning Form',
  'lightning_form_red': 'Lightning Form Red',
  'lightning_matriarch': 'Lightning Matriarch',
  'lightning_matriarch_summoned': 'Lightning Matriarch Summoned',
  'lightning_prey': 'Lightning Prey',
  'lightning_prey_redcelestial': 'Lightning Prey Red Celestial',
  'lightning_prey_summoned': 'Lightning Prey Summoned',
  'lightning_splash': 'Lightning Splash',
  'liquid_lightning': 'Liquid Lightning',
  'mage_fury': 'Mage Fury',
  'mage_wraith': 'Mage Wraith',
  'monsoon': 'Monsoon',
  'overload': 'Overload',
  'power_overload': 'Power Overload',
  'power_surge': 'Power Surge',
  'rushing_winds': 'Rushing Winds',
  'speedy_familiar': 'Speedy Familiar',
  'speedy_familiar_summoned': 'Speedy Familiar Summoned',
  'storm_atronach': 'Storm Atronach',
  'storm_prey': 'Storm Prey',
  'storm_prey_summoned': 'Storm Prey Summoned',
  'streak': 'Streak',
  'surge': 'Surge',
  'tempest': 'Tempest',
  'thunder_burst': 'Thunder Burst',
  'thunderclap': 'Thunderclap',
  'thunderclap_red': 'Thunderclap Red',
  'thundering_presence': 'Thundering Presence',
  'thunderstomp': 'Thunderstomp',
  'thunderstomp_proc': 'Thunderstomp Proc',
  'twister': 'Twister',
  'typhoon': 'Typhoon',
  'unstable_clannfear': 'Unstable Clannfear',
  'unstable_clannfear_summoned': 'Unstable Clannfear Summoned',
  'unstable_fimiliar': 'Unstable Familiar',
  'unstable_fimiliar_summoned': 'Unstable Familiar Summoned',
  'velocious_curse': 'Velocious Curse',
  'weakening_fog': 'Weakening Fog',
};

/**
 * Get display name for an ability
 * Returns the mapped display name if available, otherwise formats the filename
 */
export function getAbilityDisplayName(ability: string): string {
  // Check if we have a specific display name
  if (abilityDisplayNames[ability]) {
    return abilityDisplayNames[ability];
  }
  
  // For numeric abilities like '001', '001_a', etc., just return as is
  if (/^\d+/.test(ability)) {
    return ability;
  }
  
  // For other abilities, convert underscores to spaces and capitalize first letter of each word
  return ability
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get ability image path for a given category and ability name
 */
export function getAbilityImagePath(category: AbilityCategory, ability: string): string {
  return `/spliticons/ability/${category}/${ability}.png`;
}

/**
 * Get all categories
 */
export function getAllAbilityCategories(): AbilityCategory[] {
  return Object.keys(abilityCategories) as AbilityCategory[];
}

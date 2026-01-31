/**
 * Fonctions pures de lookup pour les valeurs d'affichage
 * Ces fonctions ne font QUE lire du JSON et retourner des valeurs à afficher
 * Aucune mutation, aucun effet de bord
 */

const RAID_LOADSCREEN_BASE_PATH = '/raid-loading-screens';

/**
 * Correspondance entre le nom du raid (selectedRaid) et le fichier loadscreen réel.
 * Les fichiers se trouvent dans public/raid-loading-screens.
 */
const RAID_LOADSCREEN_BY_NAME: Record<string, string> = {
  "Hel Ra Citadel": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_helracitadel_01.png`,
  "Aetherian Archive": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_aetherianarchive_01.png`,
  "Sanctum Ophidia": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_sanctumophidia_01.png`,
  "Cloudrest": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_cloudrest_01.png`,
  "Rockgrove": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_rockgrove_01.png`,
  "Sunspire": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_sunspire_01.png`,
  "Asylum Sanctorium": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_asylumsanctorium_01.png`,
  "Kyne's Aegis": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_kynesaegis_01.png`,
  "Dreadsail Reef": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_dreadsail_reef_trial_01.png`,
  "Sanity's Edge": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_sanitysedge_01.png`,
  "Lucent Citadel": `${RAID_LOADSCREEN_BASE_PATH}/loadscreen_lucentcitadel_01.png`,
};

const RAID_LOADSCREEN_BY_NORMALIZED_NAME = Object.fromEntries(
  Object.entries(RAID_LOADSCREEN_BY_NAME).map(([raidName, path]) => [normalizeRaidName(raidName), path])
);

function normalizeRaidName(raidName: string): string {
  return raidName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Retourne le chemin de l'image de fond en fonction du raid sélectionné dans le template.
 */
export const getRaidBackground = (raidName: string | null | undefined): string => {
  if (!raidName) return '';

  const exactMatch = RAID_LOADSCREEN_BY_NAME[raidName];
  if (exactMatch) return exactMatch;

  return RAID_LOADSCREEN_BY_NORMALIZED_NAME[normalizeRaidName(raidName)] ?? '';
};

/**
 * Retourne le titre du raid à afficher
 */
export const getRaidDisplayName = (
  selectedRaid: string | null | undefined,
  groupName: string | undefined
): string => {
  return selectedRaid || groupName || 'TTemplate';
};

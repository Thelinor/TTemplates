import { describe, expect, it } from 'vitest';
import { ESO_SETS } from './esoSets';
import { getGearIconCandidates, SET_ICON_PREFIXES } from './gearIcons';
import { SET_ICON_SOURCES } from './setIconPrefixes';
import { ArmorWeight, GearType, type GearPiece } from './raidTemplate';

const NO_GEAR_ICON_PAGE = new Set([
  "Renald's Resolve Set", 'Ring of the Wild Hunt', 'Torc of Tonal Constancy', "Malacath's Band of Brutality", 'Pearls of Ehlnofey', 'Ring of the Pale Order', "Harvester's Hope-Ring", "Death Dealer's Fete", "Shapeshifter's Chain", "Belharza's Band", 'Markyn Ring of Majesty', 'Oakensoul Ring', "Sea-Serpent's Coil", "Velothi Ur-Mage's Amulet", 'Esoteric Environment Greaves Set', 'Perfected Test of Resolve Set', 'Test of Resolve Set', 'Torc of the Last Ayleid King', 'The Saint and the Seducer', "Vandorallen's Resonance Set", 'Monomyth Reforged', 'Shattered Paths Signet', "Prowler's Talisman",
]);

const piece = (setName: string, type: GearType, overrides: Partial<GearPiece> = {}): GearPiece => ({
  setName, type, armorWeight: type === GearType.armor ? ArmorWeight.medium : null, trait: '', enchantment: '', weaponType: '', ...overrides,
});

const logicalPieces: Array<[GearPiece, string]> = [
  ...(['head', 'shoulders', 'chest', 'gloves', 'waist', 'legs', 'boots'] as const).flatMap((slot) =>
    Object.values(ArmorWeight).filter((value): value is ArmorWeight => typeof value === 'number').map((armorWeight) => [piece('', GearType.armor, { armorWeight }), slot] as [GearPiece, string])),
  [piece('', GearType.jewelry), 'ring'],
  [piece('', GearType.jewelry), 'necklace'],
  ...(['One Handed', 'Two Handed', 'Bow', 'Destruction Staff', 'Restoration Staff'] as const).map((weaponType) => [piece('', GearType.weapon, { weaponType }), 'frontWeapon'] as [GearPiece, string]),
];

describe('ESO Hub gear-icon resolver', () => {
  it('has an exact ESO Hub style for every set with a gear-icon page', () => {
    const unresolved = ESO_SETS.map((set) => set.setName).filter((name) => !SET_ICON_PREFIXES[name] && !NO_GEAR_ICON_PAGE.has(name));
    expect(unresolved).toEqual([]);
  });

  it('builds candidates for every logical gear piece of every mapped set', () => {
    for (const set of ESO_SETS) {
      if (!SET_ICON_PREFIXES[set.setName]) continue;
      for (const [basePiece, slot] of logicalPieces) {
        const candidates = getGearIconCandidates({ ...basePiece, setName: set.setName }, slot);
        expect(candidates.length, `${set.setName} / ${slot}`).toBeGreaterThan(0);
        expect(candidates[0], `${set.setName} / ${slot}`).toContain(`gear_${SET_ICON_PREFIXES[set.setName]}_`);
      }
    }
  });

  it('uses ESO Hub’s exact perfected Relequen dagger asset', () => {
    const candidates = getGearIconCandidates(piece('Perfected Arms of Relequen', GearType.weapon, { weaponType: 'One Handed' }), 'frontWeapon');
    expect(candidates).toContain('https://eso-hub.com/storage/icons/gear_welkynar_dagger_001.webp');
  });

  it('serves a real ESO Hub image for each mapped set style', async () => {
    const entries = Object.entries(SET_ICON_PREFIXES);
    const batchSize = 12;
    for (let index = 0; index < entries.length; index += batchSize) {
      const batch = entries.slice(index, index + batchSize);
      const results = await Promise.all(batch.map(async ([setName]) => {
        const response = await fetch(SET_ICON_SOURCES[setName], { method: 'HEAD' });
        return response.ok && response.headers.get('content-type')?.startsWith('image/') ? null : setName;
      }));
      expect(results.filter(Boolean), `sets ${index + 1}-${index + batch.length}`).toEqual([]);
    }
  }, 120_000);
});

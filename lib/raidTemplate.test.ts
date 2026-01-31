import { describe, expect, it } from 'vitest';
import {
  GearType,
  copyFightPlayerSetup,
  createEmptyGearPiece,
  pasteFightPlayerSetup,
  updateSetSlot,
  type GearPiece,
  type SetSlots,
} from './raidTemplate';

const weapon = (weaponType: string, setName = 'Test set'): GearPiece => ({
  ...createEmptyGearPiece(GearType.weapon),
  weaponType,
  setName,
  trait: 'Infused',
  enchantment: 'Weapon Damage',
});

const emptySlots = (): SetSlots => ({
  head: createEmptyGearPiece(), chest: createEmptyGearPiece(), waist: createEmptyGearPiece(),
  boots: createEmptyGearPiece(), shoulders: createEmptyGearPiece(), gloves: createEmptyGearPiece(), legs: createEmptyGearPiece(),
  ring1: createEmptyGearPiece(GearType.jewelry), ring2: createEmptyGearPiece(GearType.jewelry), necklace: createEmptyGearPiece(GearType.jewelry),
  mainBarWeapon1: createEmptyGearPiece(GearType.weapon), mainBarWeapon2: createEmptyGearPiece(GearType.weapon),
  backBarWeapon1: createEmptyGearPiece(GearType.weapon), backBarWeapon2: createEmptyGearPiece(GearType.weapon),
});

describe('updateSetSlot', () => {
  it.each(['Two Handed', 'Bow', 'Destruction Staff', 'Restoration Staff'])(
    'uses both weapon slots for a %s',
    (weaponType) => {
      const gear = weapon(weaponType);
      const slots = updateSetSlot(emptySlots(), 'mainBarWeapon1', gear);

      expect(slots.mainBarWeapon1).toEqual(gear);
      expect(slots.mainBarWeapon2).toEqual(gear);
      expect(slots.mainBarWeapon2).not.toBe(gear);
    },
  );

  it('keeps both slots synchronized when editing an existing two-handed weapon', () => {
    const initial = updateSetSlot(emptySlots(), 'backBarWeapon1', weapon('Bow'));
    const updated = weapon('One Handed', 'Different set');
    const slots = updateSetSlot(initial, 'backBarWeapon2', updated);

    expect(slots.backBarWeapon1).toEqual(updated);
    expect(slots.backBarWeapon2).toEqual(updated);
  });

  it('does not link one-handed weapon slots', () => {
    const slots = updateSetSlot(emptySlots(), 'mainBarWeapon1', weapon('One Handed'));

    expect(slots.mainBarWeapon2.setName).toBe('');
  });
});

describe('fight player setup copy and paste', () => {
  const player = (id: number, name: string) => ({
    id,
    name,
    role: 'DPS' as const,
    sets: emptySlots(),
    competencies: {
      MainBar1: '', MainBar2: '', MainBar3: '', MainBar4: '', MainBar5: '', MainBarUlt: '',
      BackBar1: '', BackBar2: '', BackBar3: '', BackBar4: '', BackBar5: '', BackBarUlt: '',
    },
    championPoints: {
      Blue1: '', Blue2: '', Blue3: '', Blue4: '', Red1: '', Red2: '', Red3: '', Red4: '',
      Green1: '', Green2: '', Green3: '', Green4: '',
    },
    food: '',
    potion: '',
  });

  it('copies all setup values without sharing nested JSON objects', () => {
    const source = player(1, 'Source');
    source.sets.head.setName = 'Perfected Test Set';
    source.competencies.MainBar1 = 'Test ability';
    source.championPoints.Blue1 = 'Biting Aura';
    source.food = 'Test food';
    source.potion = 'Test potion';

    const copied = copyFightPlayerSetup(source);
    source.sets.head.setName = 'Changed after copying';

    expect(copied).toMatchObject({
      sets: { head: { setName: 'Perfected Test Set' } },
      competencies: { MainBar1: 'Test ability' },
      championPoints: { Blue1: 'Biting Aura' },
      food: 'Test food',
      potion: 'Test potion',
    });
  });

  it('pastes the copied setup while keeping the target player identity', () => {
    const source = player(1, 'Source');
    source.sets.head.setName = 'Perfected Test Set';
    source.food = 'Test food';
    const target = { ...player(2, 'Target'), role: 'Tank' as const };

    const pasted = pasteFightPlayerSetup(target, copyFightPlayerSetup(source));

    expect(pasted).toMatchObject({
      id: 2,
      name: 'Target',
      role: 'Tank',
      sets: { head: { setName: 'Perfected Test Set' } },
      food: 'Test food',
    });
    expect(pasted.sets).not.toBe(source.sets);
  });
});

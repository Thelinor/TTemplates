'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArmorWeight, GearType, type GearPiece } from './raidTemplate';
import { SET_ICON_PREFIXES } from './setIconPrefixes';

export { SET_ICON_PREFIXES } from './setIconPrefixes';

const ARMOR_SLOTS = new Set(['head', 'shoulders', 'chest', 'gloves', 'waist', 'legs', 'boots']);

export function normalizeSetName(setName: string): string {
  return setName.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

export function getGearIconCandidates(gear: GearPiece, slot: string): string[] {
  if (!gear.setName) return [];

  const exactPrefix = SET_ICON_PREFIXES[gear.setName];
  // An unknown set must use the local placeholder: guessing another ESO Hub style
  // can display a valid image belonging to the wrong set.
  if (!exactPrefix) return [];
  const prefixes = [exactPrefix];
  const candidates: string[] = [];

  if (gear.type === GearType.armor && gear.armorWeight !== null && ARMOR_SLOTS.has(slot)) {
    const weight = ArmorWeight[gear.armorWeight];
    const slots = slot === 'head' ? ['head', 'helmet'] : [slot];
    for (const prefix of prefixes) {
      for (const armorSlot of slots) {
        for (const suffix of ['a', 'd', 'e']) {
          for (const extension of ['webp', 'png']) {
            candidates.push(`https://eso-hub.com/storage/icons/gear_${prefix}_${weight}_${armorSlot}_${suffix}.${extension}`);
          }
        }
      }
    }
  } else if (gear.type === GearType.jewelry) {
    const jewelrySlot = slot === 'necklace' ? 'neck' : 'ring';
    for (const prefix of prefixes) {
      for (const suffix of ['a', 'd', 'e']) {
        for (const extension of ['webp', 'png']) {
          candidates.push(`https://eso-hub.com/storage/icons/gear_${prefix}_${jewelrySlot}_${suffix}.${extension}`);
        }
      }
    }
  } else if (gear.type === GearType.weapon) {
    const weaponTypes: Record<string, string[]> = {
      'One Handed': ['sword', 'axe', 'mace', 'dagger', 'hammer', '1hsword', '1haxe', '1hmace', '1hdagger', '1hhammer'],
      'Two Handed': ['2hsword', '2haxe', '2hmaul', '2hbattleaxe', '2hgreatsword'],
      Bow: ['bow'],
      'Destruction Staff': ['firestaff', 'lightningstaff', 'froststaff'],
      'Restoration Staff': ['restorationstaff', 'staff'],
    };
    for (const prefix of prefixes) {
      for (const weaponType of weaponTypes[gear.weaponType] ?? []) {
        for (const suffix of ['a', 'd', 'e', '001']) {
          for (const extension of ['webp', 'png']) {
            candidates.push(`https://eso-hub.com/storage/icons/gear_${prefix}_${weaponType}_${suffix}.${extension}`);
          }
        }
      }
    }
  }

  return candidates;
}

type GearIconProps = {
  gear: GearPiece | undefined;
  slot: string;
  fallbackSrc: string;
  alt: string;
  className: string;
};

export function GearIcon({ gear, slot, fallbackSrc, alt, className }: GearIconProps) {
  const candidates = gear ? getGearIconCandidates(gear, slot) : [];
  const [candidateIndex, setCandidateIndex] = useState(0);
  const source = candidates[candidateIndex] ?? fallbackSrc;

  return (
    <Image
      src={source}
      alt={alt}
      width={40}
      height={40}
      className={className}
      unoptimized={source !== fallbackSrc}
      onError={() => {
        if (candidateIndex < candidates.length - 1) setCandidateIndex((index) => index + 1);
      }}
    />
  );
}


# 📋 AUDIT COMPLET DU PATTERN ARCHITECTURAL

## ✅ RÉSUMÉ EXÉCUTIF

Le codebase respecte maintenant **STRICTEMENT** le pattern architectural :
- ✅ **Chaque mutation** modifie **UNIQUEMENT** le JSON en mémoire via `RaidContext`
- ✅ **Chaque affichage** fait un **LOOKUP** dans le JSON avant de rendu

---

## 🔄 MUTATIONS (Modifications du JSON)

### Localisation: `app/RaidContext.tsx`
Toutes les mutations passent par **UNE SEULE** source: le state `template` dans `setTemplateState()`

| Mutation | Fonction Provider | Cibles JSON | Pattern |
|----------|------------------|------------|---------|
| Nom joueur | `updatePlayerName()` | `template.raid.players[id].name` | ✅ Via `updatePlayer()` + sync playersStuff |
| Rôle joueur | `updatePlayerRole()` | `template.raid.players[id].role` | ✅ Via `updatePlayer()` + sync playersStuff |
| Classes joueur | `updatePlayerClasses()` | `template.raid.players[id].skillClasses` | ✅ Direct JSON mutation |
| Masteries joueur | `updatePlayerClassMasteries()` | `template.raid.players[id].classMasteries` | ✅ Direct JSON mutation |
| Mundus joueur | `updatePlayerMundus()` | `template.raid.players[id].mundus` | ✅ Direct JSON mutation |
| Équipement fight | `updateFightPlayerStuff()` | `template.fights[0].playersStuff[id].sets[...]` | ✅ Direct JSON mutation |
| Nourriture fight | `updateFightPlayerStuff('food')` | `template.fights[0].playersStuff[id].food` | ✅ Direct JSON mutation |
| Potion fight | `updateFightPlayerStuff('potion')` | `template.fights[0].playersStuff[id].potion` | ✅ Direct JSON mutation |
| Import JSON | `loadTemplate()` | `template` (entire) | ✅ Parse + normalize + setState |
| Raid selection | `setSelectedRaid()` | `template.raid.selectedRaid` | ✅ Direct JSON mutation |

### Vérification: Aucune mutation ne contourne le provider
✅ Tous les `onChange`, `onClick` etc. → passent par `useRaid()` hooks → mutent via provider functions

---

## 👁️ AFFICHAGES (Lookups depuis le JSON)

### Pattern: Lookup JSON → Affichage

#### 1. **Nom et rôle du raid**
```typescript
// lib/raidDisplay.ts
export const getRaidDisplayName = (selectedRaid: string | null, groupName: string) => {
  return selectedRaid || groupName || 'TTemplate';  // LOOKUP dans template
}

// Utilisé par:
// - app/raid/page.tsx           ✅
// - app/cartes/page.tsx         ✅ 
// - app/raid-setup/page.tsx     ✅
// - app/tableau/page.tsx        ✅
```

#### 2. **Image de fond (background)**
```typescript
// lib/raidDisplay.ts
export const getRaidBackground = (raidName: string | null) => {
  if (!raidName) return '';  // LOOKUP selectedRaid
  const raidLower = raidName.toLowerCase().replace(/ /g, '');
  return `/raid-loading-screens/loadscreen_${raidLower}_01.png`;
}

// Utilisé par:
// - app/raid-setup/page.tsx     ✅
// - app/tableau/page.tsx        ✅
```

#### 3. **Information joueur (PlayerCard)**
```typescript
// components/PlayerCard.tsx
const { players } = useRaid();
const player = players.find((p) => p.id === playerId);  // LOOKUP dans JSON

// Affichages:
- player.name                          ✅
- player.role                          ✅
- player.skillClasses.* (3 classes)   ✅
- player.classMasteries.*             ✅
- player.mundus                        ✅
```

#### 4. **Tableau avec équipements**
```typescript
// app/tableau/page.tsx
const { players, template, updateFightPlayerStuff } = useRaid();
const fight = template.fights[0];  // LOOKUP dans JSON

// Pour chaque joueur:
const playerStuff = fight.playersStuff.find((entry) => entry.id === player.id);  // LOOKUP

// Affichages:
- playerStuff.sets.*        ✅
- playerStuff.food          ✅
- playerStuff.potion        ✅
- player.mundus             ✅
```

#### 5. **Vue détail joueur**
```typescript
// app/overview/[id]/page.tsx
const { players } = useRaid();
const player = players.find((entry) => entry.id === Number(params.id));  // LOOKUP

// Affichages:
- player.name               ✅
- player.role               ✅
- player.skillClasses.*     ✅
- player.classMasteries.*   ✅
- player.mundus             ✅
```

---

## 📊 SOURCES DE VÉRITÉ (Single Source of Truth)

```
RaidContext (React Context)
    └── template: RaidTemplateDocument (en mémoire)
        ├── raid
        │   ├── selectedRaid (utilisé par tous les lookups affichage)
        │   ├── groupName
        │   └── players[]
        │       ├── id, name, role
        │       ├── skillClasses { MainSkillClass, SecondSkillClass, ThirdSkillClass }
        │       ├── classMasteries { firstClassMastery, secondClassMastery }
        │       └── mundus
        └── fights[]
            └── playersStuff[]
                ├── id, name, role
                ├── sets {}
                ├── competencies {}
                ├── championPoints {}
                ├── food, potion
```

**AUCUNE** autre source de vérité:
- ❌ RaidSelectionContext (supprimé)
- ❌ Variables locales de state (supprimées)
- ❌ Fichiers statiques importés (supprimés)

---

## 🗂️ MODULES D'ARCHITECTURE

### `lib/raidDisplay.ts` (Fonctions PURES de lookup)
- `getRaidBackground()` - Lookup selectedRaid, retourne chemin image
- `getRaidDisplayName()` - Lookup selectedRaid/groupName, retourne nom

### `lib/templateIO.ts` (Fonctions PURES d'I/O)
- `downloadTemplateAsJson()` - Export JSON + download
- `triggerJsonImport()` - Import JSON + callback

### `app/RaidContext.tsx` (Mutations CENTRALISÉES)
- Toutes les mutations via `setTemplateState()`
- Toutes les mutations utilisent `normalizeTemplateDocument()`
- Hook: `useRaid()` - Accès au template + mutation functions

---

## ✅ VÉRIFICATIONS COMPLÉTÉES

| Élément | Vérification | Statut |
|---------|-------------|--------|
| Build TypeScript | ✓ Compiled successfully | ✅ |
| Type errors | 0 errors | ✅ |
| Routes générées | 7/7 | ✅ |
| Lookups JSON | Tous les affichages vont chercher dans template | ✅ |
| Mutations provider | Tous les onChange/onClick passent par provider | ✅ |
| Context duplication | RaidSelectionContext supprimé | ✅ |
| Import/export centralisé | Fonctions pures dans lib/templateIO.ts | ✅ |
| Mundus mutation | Corrigé dans tableau (updatePlayerMundus au lieu de updateFightPlayerStuff) | ✅ |
| Images de fond | Lookup depuis selectedRaid | ✅ |
| Noms affichés | Lookup depuis selectedRaid/groupName | ✅ |

---

## 🎯 PATTERN ARCHITECTURAL FINAL

```
┌─────────────────────────────────────────────┐
│         React Component UI Layer             │
│  (raid/, cartes/, tableau/, raid-setup/)   │
└─────────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │   Fonction Affichage   │
         │  (LOOKUP -> Display)   │
         │                        │
         │ - getRaidBackground()  │
         │ - getRaidDisplayName() │
         │ - Lecture du template  │
         └────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│       RaidContext Provider                   │
│   template: RaidTemplateDocument            │
│   Mutations: updatePlayer*(), setRaid*()   │
└─────────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │   JSON en Mémoire      │
         │   (Source Unique)      │
         │                        │
         │ template.raid.*        │
         │ template.fights[0].*   │
         └────────────────────────┘
```

---

## 📝 NOTES

- Toutes les pages utilisent `useRaid()` hook
- Aucune page n'importe de données statiques
- Aucune page ne stocke de state local pour les données du raid
- L'import/export passe par les mêmes fonctions centralisées
- Le background image change dynamiquement selon selectedRaid
- Toutes les mutations sync raid.players ET fights.playersStuff

# TTemplate

Application Next.js pour gérer un template de raid ESO, avec un modèle de données centralisé en JSON, une interface de configuration et des vues de tableau de raid.

## État actuel du projet

Le projet a été refactoré pour adopter une architecture de source unique :

- le JSON est maintenant le point central de vérité
- toutes les pages lisent le document via le provider global
- les actions d’édition modifient directement le document JSON en mémoire
- l’export/import JSON est disponible depuis le menu burger
- les personnages et les tableaux peuvent être ajoutés ou supprimés

La structure principale est la suivante :

- `app/RaidContext.tsx` : provider global du template et mutations
- `lib/template-v2.ts` : schéma canonique, création, normalisation et export
- `lib/templateIO.ts` : import/export JSON
- `app/raid-setup/page.tsx` : configuration des joueurs et raid setup
- `app/tableau/page.tsx` : vue des tableaux / édition des sets et skill abilities
- `components/BurgerMenu.tsx` : menu d’import/export et navigation

## Fonctionnalités livrées

### Gestion du template

- édition du nom, rôle, classes et masteries des joueurs
- ajout/suppression de joueurs dans la liste du JSON
- création/suppression de tableaux de combat
- sélection du raid actif
- chargement d’un template depuis un JSON importé
- export du template actuel au format JSON

### Vue tableau

- affichage du raid avec ses tableaux
- sélection de tableau actif
- mode vue / mode édition
- sélection d’ability via explorer visuel
- sélection de set via explorer visuel
- gestion des food et potion depuis l’UI
- mise à jour directe des champs dans le document JSON

### Architecture

- pas de double source de vérité locale dans les pages
- les composants lisent les données via `useRaid()`
- toutes les mutations passent par des fonctions du provider
- le JSON est exportable et réutilisable tel quel pour un import futur

## Données

Le document principal est le template JSON exposé via `lib/template-v2.ts`, avec des structures comme :

- `raid.players`
- `raid.selectedRaid`
- `fights[]`
- `fights[].playersStuff[]`
- `sets`, `competencies`, `food`, `potion`

Cela permet de conserver un format lisible et portable, compatible avec une réimportation dans l’application.

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

## Vérification

Le projet a été validé avec :

```bash
npm run build
```

Résultat vérifié : build Next.js réussi, sans erreurs TypeScript.

## Points de vigilance

- la vue tableau doit conserver l’UX historique avec des sélecteurs visuels
- les sets et les abilities doivent rester basés sur des choix plutôt que du texte libre
- le JSON doit rester lisible et exploitable comme source de données exportée

## À venir

- finaliser le rendu visuel des set icons
- compléter le rendu historique des lignes de skills/sets selon les maquettes précédentes
- poursuivre le refactor sur d’autres écrans si nécessaire

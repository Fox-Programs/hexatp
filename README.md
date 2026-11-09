# HexaTP — Terrain d'exercices : architecture hexagonale & DDD

Mini-application de rencontre (swipe / quota / abonnement) conçue en **architecture
hexagonale** et **Domain-Driven Design**. Le code est volontairement minimal et **chaque
fonction est commentée sur son processus** : il sert de support à deux exercices de conception.

## 🎯 Les exercices

| # | Sujet | Fichier |
|---|-------|---------|
| 1 | Concevoir une tranche verticale (feature « Rewind ») + diagramme de séquence | [`docs/exercice-hexagonale.md`](docs/exercice-hexagonale.md) |
| 2 | Identifier des Domain Events et les implémenter depuis un diagramme donné | [`docs/exercice-2-domain-events.md`](docs/exercice-2-domain-events.md) |

> Les corrections ne sont pas publiées : l'objectif est de pratiquer. Lis le code existant,
> puis implémente la fonctionnalité demandée en respectant la règle de dépendance de l'hexagone.

## 🧭 Principe : la dépendance pointe vers le domaine

```
Infrastructure  ──implémente──▶  Ports (Application)  ──utilise──▶  Domaine
   (adapters)                        (interfaces)                   (règles)
```

- Le **domaine** ne connaît ni la base de données, ni le framework.
- L'**application** définit des *ports* (interfaces) et orchestre le domaine.
- L'**infrastructure** fournit des *adaptateurs* (ici en mémoire).

## 📁 Arborescence

```
src/
├── domain/                     # Coeur métier (aucune dépendance externe)
│   ├── ids.ts                  # Identifiants typés
│   ├── decision.ts             # Decision (enum) + DecisionSwipe (Value Object)
│   ├── swipe.ts                # Swipe (Aggregate Root) + StatutInteraction
│   ├── compteur-swipe.ts       # CompteurSwipe (Aggregate Root)
│   ├── abonnement.ts           # Abonnement (Aggregate Root) + StatutAbonnement
│   ├── quota-swipe.ts          # QuotaSwipe (Domain Policy)
│   └── politique-exposition.ts # PolitiqueExposition (Domain Policy)
├── application/
│   ├── ports/                  # Interfaces (ports) vers l'extérieur
│   └── service-decouverte.ts   # ServiceDecouverte (Application Service)
├── infrastructure/             # Adaptateurs (implémentations in-memory)
└── demo/main.ts                # Composition root + scénario de démo
tests/                          # Tests Vitest du cas d'usage principal
docs/                           # Énoncés des exercices
```

## 🚀 Démarrer

```bash
npm install
npm run demo      # joue le scénario Alice/Bob -> MATCHED
npm test          # lance les tests Vitest
npm run typecheck # vérifie le typage strict
```

## 🗺️ Mapping diagramme → code

| Concept DDD | Fichier |
|-------------|---------|
| `Swipe` / `StatutInteraction` | `domain/swipe.ts` |
| `DecisionSwipe` / `Decision` | `domain/decision.ts` |
| `CompteurSwipe` | `domain/compteur-swipe.ts` |
| `Abonnement` / `StatutAbonnement` | `domain/abonnement.ts` |
| `QuotaSwipe` / `PolitiqueExposition` (policies) | `domain/quota-swipe.ts`, `domain/politique-exposition.ts` |
| `ServiceDecouverte` | `application/service-decouverte.ts` |
| Repositories (ports) | `application/ports/*.ts` |

## 📄 Licence

MIT.

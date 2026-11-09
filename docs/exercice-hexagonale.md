# 🎯 Exercice — Concevoir une tranche verticale en archi hexagonale

| Champ | Valeur |
|-------|--------|
| **Difficulté** | 🟡 Intermédiaire |
| **Temps** | ~45 minutes |
| **Niveau cognitif** | Comprendre → Analyser → Créer (Bloom) |
| **Prérequis** | Bases DDD (agrégat, value object, policy), principe de dépendance hexagonale, TypeScript |
| **Type** | Jeu d'exercices (classification + repérage + conception) |

> 💡 **Vertical slice** : au lieu de coder une couche entière, on implémente **une seule fonctionnalité de bout en bout** — du domaine jusqu'à l'adaptateur. C'est la meilleure façon de vérifier qu'on a compris le découpage hexagonal.

---

## Contexte : le projet HexaTP

Mini-application de rencontre. L'architecture actuelle :

```
src/
├── domain/          # cœur métier, AUCUNE dépendance externe
│   ├── swipe.ts                # Swipe (Aggregate Root) + StatutInteraction
│   ├── decision.ts             # Decision (enum) + DecisionSwipe (Value Object)
│   ├── compteur-swipe.ts       # CompteurSwipe (Aggregate Root)
│   ├── abonnement.ts           # Abonnement (Aggregate Root) + StatutAbonnement
│   ├── quota-swipe.ts          # QuotaSwipe (Domain Policy)
│   └── politique-exposition.ts # PolitiqueExposition (Domain Policy)
├── application/
│   ├── ports/                  # interfaces vers l'extérieur
│   │   ├── interaction-repository.ts
│   │   ├── compteur-swipe-repository.ts
│   │   └── abonnement-repository.ts
│   └── service-decouverte.ts   # ServiceDecouverte (Application Service)
└── infrastructure/             # adaptateurs in-memory implémentant les ports
```

**Règle d'or de l'hexagone** : les dépendances pointent **toujours vers le domaine**.
`infrastructure → application (ports) → domaine`. Le domaine, lui, ne connaît personne.

Extrait de l'agrégat `Swipe` (état actuel) :

```typescript
export class Swipe {
  private readonly decisions: DecisionSwipe[] = [];
  private statut: StatutInteraction = StatutInteraction.PENDING;

  enregistrerDecision(decision: DecisionSwipe): void { /* ... */ }
  determinerResultat(): StatutInteraction { /* recalcule le statut */ }
  getStatut(): StatutInteraction { return this.statut; }
}
```

---

## 🧩 Partie A — Comprendre : classer les responsabilités (10 min)

On veut ajouter la fonctionnalité **« Rewind »** : un utilisateur peut **annuler sa dernière décision** (il a swipé trop vite). Cette fonctionnalité est **réservée aux abonnés premium actifs**.

Pour chacune des 7 responsabilités ci-dessous, indique dans **quelle couche** elle doit vivre :
`Domaine (agrégat)` · `Domaine (policy)` · `Port (application)` · `Service applicatif` · `Adaptateur (infra)`.

| # | Responsabilité | Couche ? |
|---|----------------|----------|
| 1 | Retirer la dernière décision d'une interaction et recalculer son statut | ? |
| 2 | Vérifier que l'utilisateur a un abonnement actif pour avoir le droit d'annuler | ? |
| 3 | Retrouver en base la dernière interaction où l'utilisateur a pris une décision | ? |
| 4 | Orchestrer : vérifier le droit → charger l'interaction → annuler → sauvegarder | ? |
| 5 | Déclarer l'interface `trouverDerniereDecisionDe(utilisateurId)` | ? |
| 6 | Écrire la requête SQL concrète qui lit la dernière interaction | ? |
| 7 | Décider qu'une annulation remet le statut à `PENDING` | ? |

---

## 🔍 Partie B — Analyser : repérer la violation (10 min)

Un collègue propose ce code pour la policy de rewind. **Identifie la ou les violations de l'architecture hexagonale** et explique pourquoi c'est un problème.

```typescript
// src/domain/politique-rewind.ts
import { InMemoryAbonnementRepository } from '../infrastructure/in-memory-abonnement-repository.js';

export class PolitiqueRewind {
  private readonly repo = new InMemoryAbonnementRepository();

  async peutAnnuler(utilisateurId: UtilisateurId): Promise<boolean> {
    const abonnement = await this.repo.obtenirActif(utilisateurId);
    return abonnement !== null && abonnement.estActif(new Date());
  }
}
```

Questions :
1. Quelle(s) règle(s) de l'hexagone ce code viole-t-il ? (sois précis sur la direction de dépendance)
2. Quel problème concret cela pose-t-il pour **tester** cette policy ?
3. Propose la **signature corrigée** de `peutAnnuler(...)` (sans implémentation), qui respecte l'hexagone.

---

## 🧭 Partie B′ — Appliquer : dessiner le diagramme de séquence (10 min)

Avant d'écrire la moindre ligne, **dessine le diagramme de séquence du cas nominal** du Rewind
(un abonné premium annule sa dernière décision avec succès). Ce diagramme sera ton **plan
d'implémentation** pour la Partie C.

Participants à faire figurer (acteurs/objets) :
`Utilisateur` · `ServiceDecouverte` · `AbonnementRepository` · `PolitiqueRewind` · `InteractionRepository` · `Swipe`

Contraintes de conception à respecter dans tes flèches :
- La **direction des appels** doit refléter l'hexagone : c'est le **service** qui pilote, le domaine
  ne connaît ni les ports ni l'infra.
- Montre **qui charge l'abonnement** et **à qui il est transmis**.
- Fais apparaître le **retour** du statut recalculé jusqu'à l'utilisateur.

> 🎯 Point de vigilance : deux pièges classiques sont faciles à dessiner par erreur. Demande-toi
> si la **policy** doit *aller chercher* l'abonnement, et si l'**agrégat** `Swipe` doit *appeler*
> le repository. (La correction montre ces deux anti-patterns.)

Format libre : PlantUML, Mermaid, ou schéma papier photographié.

---

## 🛠️ Partie C — Créer : implémenter la tranche verticale (25 min)

Implémente la fonctionnalité **Rewind** de bout en bout. Produis **4 morceaux de code**, chacun commenté sur son processus.

### C.1 — Domaine (agrégat)
Ajoute à `Swipe` une méthode `annulerDecisionDe(emetteurId: UtilisateurId): void` qui :
- retire la décision de cet émetteur,
- recalcule le statut via la logique existante.

### C.2 — Domaine (policy)
Crée `PolitiqueRewind` avec une méthode **pure** `peutAnnuler(abonnement: Abonnement | null, aLaDate: Date): boolean` (premium actif requis). Aucune dépendance infra.

### C.3 — Port (application)
Ajoute au port `InteractionRepository` la signature permettant de retrouver la dernière interaction décidée par un utilisateur.

### C.4 — Service applicatif
Ajoute à `ServiceDecouverte` une méthode `annulerDerniereDecision(utilisateurId): Promise<StatutInteraction>` qui orchestre : vérification du droit (policy) → récupération via le port → annulation sur l'agrégat → sauvegarde.

### Contraintes
- Le **domaine n'importe rien** de `application/` ni `infrastructure/`.
- La policy C.2 doit être **testable sans base de données** (fonction pure).
- Respecte les conventions du projet (ESM, imports en `.js`, commentaires de processus).

<details>
<summary>💡 Indice 1 (nudge)</summary>

Demande-toi, pour chaque bout de code : « est-ce une **règle métier** (domaine), une **orchestration** (service), un **contrat** (port) ou un **détail technique** (adaptateur) ? ». La fonctionnalité réutilise `Abonnement.estActif(...)` qui existe déjà.
</details>

<details>
<summary>💡 Indice 2 (direction)</summary>

- Pour retirer une décision, il faut d'abord **exposer** le tableau privé via une méthode de l'agrégat (ne jamais le rendre public).
- Le service ne doit **jamais** instancier un adaptateur : il reçoit ses dépendances via le **constructeur** (injection), exactement comme `ServiceDecouverte` reçoit déjà ses repositories et policies.
- Le port doit renvoyer `Swipe | null` (il se peut qu'il n'y ait rien à annuler).
</details>

<details>
<summary>💡 Indice 3 (near-solution)</summary>

```typescript
// Domaine — Swipe
annulerDecisionDe(emetteurId: UtilisateurId): void {
  const i = this.decisions.findIndex((d) => d.emetteurId === emetteurId);
  if (i === -1) return;
  this.decisions.splice(i, 1);
  this.determinerResultat(); // recalcule : revient à PENDING si plus de décisions
}

// Service — injection, puis orchestration
if (!this.rewind.peutAnnuler(abonnement, maintenant)) throw new Error('Rewind premium requis');
const interaction = await this.interactions.trouverDerniereDecisionDe(utilisateurId);
```
</details>

---

## 📋 Barème global (/20)

| Critère | Points |
|---------|--------|
| Partie A — classement correct des 7 responsabilités | 6 |
| Partie B — violations identifiées + signature corrigée | 3 |
| Partie B′ — diagramme de séquence correct (direction des appels, policy/agrégat sans I/O) | 3 |
| Partie C.1/C.2 — logique métier au bon endroit, policy pure | 4 |
| Partie C.3/C.4 — port minimal + service qui orchestre sans logique métier dure | 4 |
| **Total** | **20** |

> ✅ La correction détaillée se trouve dans `correction-exercice-hexagonale.md`.

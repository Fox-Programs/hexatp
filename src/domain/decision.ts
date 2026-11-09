import type { UtilisateurId } from './ids.js';

/** Choix possible d'un utilisateur face à un profil. */
export enum Decision {
  OUI = 'OUI',
  NON = 'NON',
}

/**
 * Value Object : une décision émise par un utilisateur.
 * Immuable — on ne modifie jamais une décision, on en crée une nouvelle.
 */
export class DecisionSwipe {
  constructor(
    public readonly emetteurId: UtilisateurId,
    public readonly decision: Decision,
    public readonly dateDecision: Date,
  ) {
    // Processus : on fige l'objet pour garantir l'immuabilité du VO.
    Object.freeze(this);
  }
}

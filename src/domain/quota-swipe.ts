import type { Abonnement } from './abonnement.js';
import type { CompteurSwipe } from './compteur-swipe.js';

/**
 * Domain Policy : règle de quota de swipes.
 * Un abonné actif n'a pas de limite ; un utilisateur gratuit est plafonné.
 */
export class QuotaSwipe {
  constructor(
    private readonly limiteGratuite: number,
    /** Durée de la période en millisecondes (ex: 24h). */
    public readonly dureePeriodeMs: number,
  ) {}

  /**
   * Vérifie si l'utilisateur peut encore émettre une décision.
   * Processus :
   *  1. Si un abonnement est actif aujourd'hui => autorisé (illimité).
   *  2. Sinon, on compare les décisions déjà émises à la limite gratuite.
   */
  verifierQuota(
    compteur: CompteurSwipe,
    abonnement: Abonnement | null,
    aLaDate: Date = new Date(),
  ): boolean {
    if (abonnement?.estActif(aLaDate)) {
      return true;
    }
    return compteur.getDecisionsEmises() < this.limiteGratuite;
  }
}

import type { UtilisateurId } from './ids.js';

/**
 * Aggregate Root : compte les décisions émises par un utilisateur
 * sur une période glissante (pour appliquer le quota gratuit).
 */
export class CompteurSwipe {
  constructor(
    public readonly utilisateurId: UtilisateurId,
    public readonly dateDebutPeriode: Date,
    public readonly dateFinPeriode: Date,
    private decisionsEmises: number = 0,
  ) {}

  /**
   * Incrémente le compteur de décisions.
   * Processus : une décision = une unité consommée sur la période courante.
   */
  enregistrerDecision(): void {
    this.decisionsEmises += 1;
  }

  getDecisionsEmises(): number {
    return this.decisionsEmises;
  }

  /** Indique si la date du jour est encore dans la période du compteur. */
  estDansPeriode(aLaDate: Date): boolean {
    return aLaDate >= this.dateDebutPeriode && aLaDate <= this.dateFinPeriode;
  }
}

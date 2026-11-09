/**
 * Domain Policy : évite de ré-exposer trop vite le même profil.
 * Simple règle de délai minimal entre deux expositions.
 */
export class PolitiqueExposition {
  constructor(
    /** Délai minimal avant réexposition, en millisecondes. */
    private readonly delaiMinimalMs: number,
  ) {}

  /**
   * Vérifie si un profil peut être ré-exposé.
   * Processus : compare l'écart entre maintenant et la dernière exposition
   * au délai minimal configuré. Jamais exposé => toujours autorisé.
   */
  verifierDelaiAvantNouvelleExposition(
    derniereExposition: Date | null,
    maintenant: Date = new Date(),
  ): boolean {
    if (derniereExposition === null) {
      return true;
    }
    return maintenant.getTime() - derniereExposition.getTime() >= this.delaiMinimalMs;
  }
}

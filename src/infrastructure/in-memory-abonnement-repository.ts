import type { Abonnement } from '../domain/abonnement.js';
import type { UtilisateurId } from '../domain/ids.js';
import type { AbonnementRepository } from '../application/ports/abonnement-repository.js';

/**
 * Adaptateur : abonnements en mémoire.
 * On alimente la map depuis le code appelant (seed) pour les tests/démo.
 */
export class InMemoryAbonnementRepository implements AbonnementRepository {
  private readonly parUtilisateur = new Map<string, Abonnement>();

  /** Helper de test : associe un abonnement à un utilisateur. */
  seed(abonnement: Abonnement): void {
    this.parUtilisateur.set(abonnement.utilisateurId, abonnement);
  }

  async obtenirActif(utilisateurId: UtilisateurId): Promise<Abonnement | null> {
    return this.parUtilisateur.get(utilisateurId) ?? null;
  }
}

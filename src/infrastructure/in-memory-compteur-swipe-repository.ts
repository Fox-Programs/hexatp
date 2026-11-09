import { CompteurSwipe } from '../domain/compteur-swipe.js';
import type { UtilisateurId } from '../domain/ids.js';
import type { CompteurSwipeRepository } from '../application/ports/compteur-swipe-repository.js';

/**
 * Adaptateur : compteurs de swipes en mémoire.
 * Initialise une période de 24h si aucun compteur n'existe encore.
 */
export class InMemoryCompteurSwipeRepository implements CompteurSwipeRepository {
  private readonly parUtilisateur = new Map<string, CompteurSwipe>();

  async obtenirPourUtilisateur(utilisateurId: UtilisateurId): Promise<CompteurSwipe> {
    let compteur = this.parUtilisateur.get(utilisateurId);
    if (!compteur) {
      const debut = new Date();
      const fin = new Date(debut.getTime() + 24 * 60 * 60 * 1000);
      compteur = new CompteurSwipe(utilisateurId, debut, fin);
      this.parUtilisateur.set(utilisateurId, compteur);
    }
    return compteur;
  }

  async sauvegarder(compteur: CompteurSwipe): Promise<void> {
    this.parUtilisateur.set(compteur.utilisateurId, compteur);
  }
}

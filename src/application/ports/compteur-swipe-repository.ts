import type { CompteurSwipe } from '../../domain/compteur-swipe.js';
import type { UtilisateurId } from '../../domain/ids.js';

/**
 * Port : accès au compteur de swipes d'un utilisateur.
 */
export interface CompteurSwipeRepository {
  /** Récupère (ou initialise) le compteur de la période courante. */
  obtenirPourUtilisateur(utilisateurId: UtilisateurId): Promise<CompteurSwipe>;
  /** Persiste le compteur mis à jour. */
  sauvegarder(compteur: CompteurSwipe): Promise<void>;
}

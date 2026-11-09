import type { Abonnement } from '../../domain/abonnement.js';
import type { UtilisateurId } from '../../domain/ids.js';

/**
 * Port : accès à l'abonnement actif d'un utilisateur.
 */
export interface AbonnementRepository {
  /** Retourne l'abonnement actif de l'utilisateur, ou null s'il est gratuit. */
  obtenirActif(utilisateurId: UtilisateurId): Promise<Abonnement | null>;
}

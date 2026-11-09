/**
 * Identifiants typés (branded types).
 * But : éviter de confondre un UtilisateurId avec une simple string,
 * tout en restant ultra-simple (pas de classe, juste un type nominal).
 */

export type UtilisateurId = string & { readonly __brand: 'UtilisateurId' };
export type InteractionId = string & { readonly __brand: 'InteractionId' };
export type AbonnementId = string & { readonly __brand: 'AbonnementId' };

/** Fabriques triviales pour marquer une string comme identifiant typé. */
export const UtilisateurId = (valeur: string): UtilisateurId => valeur as UtilisateurId;
export const InteractionId = (valeur: string): InteractionId => valeur as InteractionId;
export const AbonnementId = (valeur: string): AbonnementId => valeur as AbonnementId;

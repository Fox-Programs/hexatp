import type { AbonnementId, UtilisateurId } from './ids.js';

/** Statut d'un abonnement payant. */
export enum StatutAbonnement {
  ACTIF = 'ACTIF',
  SUSPENDU = 'SUSPENDU',
  RESILIE = 'RESILIE',
  EXPIRE = 'EXPIRE',
}

/**
 * Aggregate Root : l'abonnement d'un utilisateur.
 * Détermine si l'utilisateur bénéficie d'un accès premium (swipes illimités).
 */
export class Abonnement {
  constructor(
    public readonly id: AbonnementId,
    public readonly utilisateurId: UtilisateurId,
    public readonly dateDebut: Date,
    public readonly dateFin: Date,
    public readonly statut: StatutAbonnement,
  ) {}

  /**
   * Indique si l'abonnement est actif à une date donnée.
   * Processus :
   *  1. Le statut doit être ACTIF.
   *  2. La date doit tomber dans la fenêtre [dateDebut, dateFin].
   */
  estActif(aLaDate: Date): boolean {
    return (
      this.statut === StatutAbonnement.ACTIF &&
      aLaDate >= this.dateDebut &&
      aLaDate <= this.dateFin
    );
  }
}

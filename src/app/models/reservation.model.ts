export interface Reservation {
  id?: string;
  eventId: string;
  nom: string;
  prenom: string;
  numeroWhatsapp: string;
  email?: string;
  nombrePlaces: number;
  modaliteEntree: string;
  modalitePaiement: string;
  montantTotal: number;
  estPaye: boolean;
  estValide: boolean;
  dateReservation: Date;
  commentaire?: string;
}

export interface ReservationStats {
  totalReservations: number;
  totalPlacesReservees: number;
  totalPaye: number;
  totalNonPaye: number;
  totalValide: number;
  totalNonValide: number;
  revenusTotal: number;
  revenusRecus: number;
}

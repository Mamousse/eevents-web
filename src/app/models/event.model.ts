export interface Event {
  id?: string;
  nom: string;
  date: Date;
  emplacement: string;
  nombrePlacesDisponibles: number;
  nombrePlacesReservees?: number;
  modalitesEntree: ModaliteEntree[];
  modalitesPaiement: ModalitePaiement[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  qrCodeUrl?: string;
  lienReservation?: string;
  photos?: string[];
  flyerUrl?: string;
}

export interface ModaliteEntree {
  type: string; // Ex: "VIP", "Standard", "Gratuit"
  prix: number;
  description?: string;
}

export interface ModalitePaiement {
  type: string; // Ex: "Espèces", "Mobile Money", "Carte bancaire", "Virement"
  details?: string;
}

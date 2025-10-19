import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reservation, ReservationStats } from '../models/reservation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseurl = environment.apiUrl;
  private apiUrl = this.baseurl + '/reservations';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les réservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  // Récupérer les réservations par événement
  getReservationsByEventId(eventId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}?filter[where][eventId]=${eventId}`);
  }

  // Récupérer une réservation par ID
  getReservationById(id: string): Observable<Reservation | undefined> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle réservation
  createReservation(reservation: Omit<Reservation, 'id' | 'dateReservation'>): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  // Mettre à jour une réservation
  updateReservation(id: string, reservation: Partial<Reservation>): Observable<Reservation | undefined> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  // Valider une réservation
  validateReservation(id: string): Observable<Reservation | undefined> {
    return this.updateReservation(id, { estValide: true });
  }

  // Marquer comme payé
  markAsPaid(id: string): Observable<Reservation | undefined> {
    return this.updateReservation(id, { estPaye: true });
  }

  // Supprimer une réservation
  deleteReservation(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(map(() => true));
  }

  // Obtenir les statistiques d'un événement
  getEventStats(eventId: string): Observable<ReservationStats> {
    return this.getReservationsByEventId(eventId).pipe(
      map(eventReservations => {
        const stats: ReservationStats = {
          totalReservations: eventReservations.length,
          totalPlacesReservees: eventReservations.reduce((sum, r) => sum + r.nombrePlaces, 0),
          totalPaye: eventReservations.filter(r => r.estPaye).length,
          totalNonPaye: eventReservations.filter(r => !r.estPaye).length,
          totalValide: eventReservations.filter(r => r.estValide).length,
          totalNonValide: eventReservations.filter(r => !r.estValide).length,
          revenusTotal: eventReservations.reduce((sum, r) => sum + r.montantTotal, 0),
          revenusRecus: eventReservations.filter(r => r.estPaye).reduce((sum, r) => sum + r.montantTotal, 0)
        };
        return stats;
      })
    );
  }

  // Rechercher des réservations
  searchReservations(eventId: string, query: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}?filter[where][eventId]=${eventId}&filter[where][or][0][nom][regexp]=/${query}/i&filter[where][or][1][prenom][regexp]=/${query}/i&filter[where][or][2][numeroWhatsapp][like]=${query}`);
  }
}

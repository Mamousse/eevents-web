import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseurl = environment.apiUrl;
  private apiUrl = this.baseurl + '/events';

  constructor(private http: HttpClient) { }

  // Récupérer tous les événements
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  // Récupérer un événement par ID
  getEventById(id: string): Observable<Event | undefined> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel événement
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  // Mettre à jour un événement
  updateEvent(id: string, event: Partial<Event>): Observable<Event | undefined> {
    return this.http.patch<Event>(`${this.apiUrl}/${id}`, event);
  }

  // Supprimer un événement
  deleteEvent(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(map(() => true));
  }

  // Rechercher des événements
  searchEvents(query: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}?filter[where][or][0][nom][regexp]=/${query}/i&filter[where][or][1][emplacement][regexp]=/${query}/i`);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  searchQuery = '';

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements:', error);
        this.loading = false;
      }
    });
  }

  searchEvents(): void {
    if (!this.searchQuery.trim()) {
      this.filteredEvents = this.events;
      return;
    }

    this.eventService.searchEvents(this.searchQuery).subscribe({
      next: (events) => {
        this.filteredEvents = events;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
      }
    });
  }

  createEvent(): void {
    this.router.navigate(['/admin/events/new']);
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/admin/events/edit', eventId]);
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/admin/events', eventId]);
  }

  deleteEvent(event: Event): void {
    if (!event.id) return;

    const confirmDelete = confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.nom}" ?`);
    if (confirmDelete) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Une erreur est survenue lors de la suppression');
        }
      });
    }
  }

  getPlacesRestantes(event: Event): number {
    const reservees = event.nombrePlacesReservees || 0;
    return event.nombrePlacesDisponibles - reservees;
  }

  getTauxRemplissage(event: Event): number {
    const reservees = event.nombrePlacesReservees || 0;
    return (reservees / event.nombrePlacesDisponibles) * 100;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  copyReservationLink(event: Event): void {
    const link = `${window.location.origin}/reservation/${event.id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Lien de réservation copié !');
    });
  }
}

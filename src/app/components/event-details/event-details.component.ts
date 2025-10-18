import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ReservationService } from '../../services/reservation.service';
import { Event } from '../../models/event.model';
import { Reservation, ReservationStats } from '../../models/reservation.model';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  eventId: string = '';
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  stats: ReservationStats | null = null;
  loading = false;
  searchQuery = '';
  qrCodeData = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEventData();
  }

  loadEventData(): void {
    this.loading = true;

    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        if (event) {
          this.qrCodeData = `${window.location.origin}/reservation/${this.eventId}`;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading = false;
      }
    });

    this.reservationService.getReservationsByEventId(this.eventId).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.filteredReservations = reservations;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });

    this.reservationService.getEventStats(this.eventId).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  searchReservations(): void {
    if (!this.searchQuery.trim()) {
      this.filteredReservations = this.reservations;
      return;
    }

    this.reservationService.searchReservations(this.eventId, this.searchQuery).subscribe({
      next: (reservations) => {
        this.filteredReservations = reservations;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  toggleValidation(reservation: Reservation): void {
    if (!reservation.id) return;

    this.reservationService.updateReservation(reservation.id, {
      estValide: !reservation.estValide
    }).subscribe({
      next: () => {
        this.loadEventData();
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  togglePaiement(reservation: Reservation): void {
    if (!reservation.id) return;

    this.reservationService.updateReservation(reservation.id, {
      estPaye: !reservation.estPaye
    }).subscribe({
      next: () => {
        this.loadEventData();
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  deleteReservation(reservation: Reservation): void {
    if (!reservation.id) return;

    const confirmDelete = confirm(`Supprimer la réservation de ${reservation.prenom} ${reservation.nom} ?`);
    if (confirmDelete) {
      this.reservationService.deleteReservation(reservation.id).subscribe({
        next: () => {
          this.loadEventData();
          // Mettre à jour le nombre de places réservées
          if (this.event) {
            const placesReservees = (this.event.nombrePlacesReservees || 0) - reservation.nombrePlaces;
            this.eventService.updateEvent(this.eventId, {
              nombrePlacesReservees: placesReservees
            }).subscribe();
          }
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });
    }
  }

  shareWhatsApp(): void {
    const text = `Réservez votre place pour ${this.event?.nom}!\nDate: ${new Date(this.event?.date || '').toLocaleDateString()}\nLieu: ${this.event?.emplacement}\nLien: ${this.qrCodeData}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.qrCodeData).then(() => {
      alert('Lien copié dans le presse-papier !');
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}

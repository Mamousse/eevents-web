import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ReservationService } from '../../services/reservation.service';
import { Event, ModaliteEntree } from '../../models/event.model';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  event: Event | undefined;
  eventId: string = '';
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  selectedModalite: ModaliteEntree | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';

    this.reservationForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      numeroWhatsapp: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      email: ['', [Validators.email]],
      nombrePlaces: [1, [Validators.required, Validators.min(1)]],
      modaliteEntree: ['', Validators.required],
      modalitePaiement: ['', Validators.required],
      commentaire: ['']
    });

    this.loadEvent();

    // Calculer le montant total quand la modalité ou le nombre de places change
    this.reservationForm.get('modaliteEntree')?.valueChanges.subscribe(() => {
      this.updateSelectedModalite();
    });
    this.reservationForm.get('nombrePlaces')?.valueChanges.subscribe(() => {
      this.updateSelectedModalite();
    });
  }

  loadEvent(): void {
    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
        if (!event) {
          this.errorMessage = 'Événement non trouvé';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erreur lors du chargement de l\'événement';
        console.error(error);
      }
    });
  }

  updateSelectedModalite(): void {
    const modaliteType = this.reservationForm.get('modaliteEntree')?.value;
    if (this.event && modaliteType) {
      this.selectedModalite = this.event.modalitesEntree.find(m => m.type === modaliteType) || null;
    }
  }

  get f() {
    return this.reservationForm.controls;
  }

  getMontantTotal(): number {
    if (!this.selectedModalite) return 0;
    const nombrePlaces = this.reservationForm.get('nombrePlaces')?.value || 1;
    return this.selectedModalite.prix * nombrePlaces;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.reservationForm.invalid) {
      return;
    }

    if (!this.event) {
      this.errorMessage = 'Événement non trouvé';
      return;
    }

    // Vérifier la disponibilité
    const nombrePlaces = this.reservationForm.value.nombrePlaces;
    const placesReservees = this.event.nombrePlacesReservees || 0;
    if (placesReservees + nombrePlaces > this.event.nombrePlacesDisponibles) {
      this.errorMessage = 'Désolé, il n\'y a plus assez de places disponibles pour cette réservation.';
      return;
    }

    this.loading = true;

    const reservation = {
      eventId: this.eventId,
      nom: this.reservationForm.value.nom,
      prenom: this.reservationForm.value.prenom,
      numeroWhatsapp: this.reservationForm.value.numeroWhatsapp,
      email: this.reservationForm.value.email,
      nombrePlaces: this.reservationForm.value.nombrePlaces,
      modaliteEntree: this.reservationForm.value.modaliteEntree,
      modalitePaiement: this.reservationForm.value.modalitePaiement,
      montantTotal: this.getMontantTotal(),
      estPaye: false,
      estValide: false,
      commentaire: this.reservationForm.value.commentaire
    };

    this.reservationService.createReservation(reservation).subscribe({
      next: (result) => {
        this.loading = false;
        this.successMessage = 'Votre réservation a été enregistrée avec succès ! Vous serez contacté prochainement.';
        this.reservationForm.reset();
        this.submitted = false;

        // Mettre à jour le nombre de places réservées
        if (this.event) {
          this.eventService.updateEvent(this.eventId, {
            nombrePlacesReservees: placesReservees + nombrePlaces
          }).subscribe();
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Une erreur est survenue lors de l\'enregistrement de votre réservation.';
        console.error(error);
      }
    });
  }

  getPlacesDisponibles(): number {
    if (!this.event) return 0;
    const reservees = this.event.nombrePlacesReservees || 0;
    return this.event.nombrePlacesDisponibles - reservees;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.eventId;

    this.initForm();

    if (this.isEditMode && this.eventId) {
      this.loadEvent();
    }
  }

  initForm(): void {
    this.eventForm = this.formBuilder.group({
      nom: ['', Validators.required],
      date: ['', Validators.required],
      emplacement: ['', Validators.required],
      nombrePlacesDisponibles: [0, [Validators.required, Validators.min(1)]],
      description: [''],
      modalitesEntree: this.formBuilder.array([this.createModaliteEntree()]),
      modalitesPaiement: this.formBuilder.array([this.createModalitePaiement()])
    });
  }

  createModaliteEntree(): FormGroup {
    return this.formBuilder.group({
      type: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  createModalitePaiement(): FormGroup {
    return this.formBuilder.group({
      type: ['', Validators.required],
      details: ['']
    });
  }

  get modalitesEntree(): FormArray {
    return this.eventForm.get('modalitesEntree') as FormArray;
  }

  get modalitesPaiement(): FormArray {
    return this.eventForm.get('modalitesPaiement') as FormArray;
  }

  addModaliteEntree(): void {
    this.modalitesEntree.push(this.createModaliteEntree());
  }

  removeModaliteEntree(index: number): void {
    if (this.modalitesEntree.length > 1) {
      this.modalitesEntree.removeAt(index);
    }
  }

  addModalitePaiement(): void {
    this.modalitesPaiement.push(this.createModalitePaiement());
  }

  removeModalitePaiement(index: number): void {
    if (this.modalitesPaiement.length > 1) {
      this.modalitesPaiement.removeAt(index);
    }
  }

  loadEvent(): void {
    if (!this.eventId) return;

    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {
        if (event) {
          this.patchFormValue(event);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'événement';
        this.loading = false;
        console.error(error);
      }
    });
  }

  patchFormValue(event: Event): void {
    // Convertir la date au format requis pour input datetime-local
    const dateObj = new Date(event.date);
    const formattedDate = this.formatDateForInput(dateObj);

    this.eventForm.patchValue({
      nom: event.nom,
      date: formattedDate,
      emplacement: event.emplacement,
      nombrePlacesDisponibles: event.nombrePlacesDisponibles,
      description: event.description || ''
    });

    // Remplir les modalités d'entrée
    this.modalitesEntree.clear();
    event.modalitesEntree.forEach(modalite => {
      this.modalitesEntree.push(this.formBuilder.group({
        type: [modalite.type, Validators.required],
        prix: [modalite.prix, [Validators.required, Validators.min(0)]],
        description: [modalite.description || '']
      }));
    });

    // Remplir les modalités de paiement
    this.modalitesPaiement.clear();
    event.modalitesPaiement.forEach(modalite => {
      this.modalitesPaiement.push(this.formBuilder.group({
        type: [modalite.type, Validators.required],
        details: [modalite.details || '']
      }));
    });
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.eventForm.invalid) {
      return;
    }

    this.loading = true;

    const eventData: any = {
      ...this.eventForm.value,
      date: new Date(this.eventForm.value.date)
    };

    if (this.isEditMode && this.eventId) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          this.successMessage = 'Événement mis à jour avec succès !';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = 'Une erreur est survenue lors de la mise à jour';
          this.loading = false;
          console.error(error);
        }
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.successMessage = 'Événement créé avec succès !';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = 'Une erreur est survenue lors de la création';
          this.loading = false;
          console.error(error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { UploadService } from '../../services/upload.service';
import { Event } from '../../models/event.model';
import { forkJoin } from 'rxjs';

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
  selectedFiles: File[] = [];
  uploadedPhotos: string[] = [];
  uploading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private uploadService: UploadService
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
      type: ['Espèces', Validators.required], // Valeur par défaut
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

    // Charger les photos existantes
    if (event.photos && event.photos.length > 0) {
      this.uploadedPhotos = event.photos;
    }

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

  // Gérer la sélection de fichiers
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
      // Upload immédiat
      this.uploadFiles();
    }
  }

  // Upload les fichiers sélectionnés
  uploadFiles(): void {
    if (this.selectedFiles.length === 0) return;

    this.uploading = true;
    this.uploadService.uploadMultipleFiles(this.selectedFiles).subscribe({
      next: (responses) => {
        responses.forEach(response => {
          this.uploadedPhotos.push(response.url);
        });
        this.selectedFiles = [];
        this.uploading = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'upload:', error);
        this.errorMessage = 'Erreur lors de l\'upload des photos';
        this.uploading = false;
      }
    });
  }

  // Retirer un fichier de la liste de sélection
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // Retirer une photo déjà uploadée
  removeUploadedPhoto(index: number): void {
    this.uploadedPhotos.splice(index, 1);
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
      date: new Date(this.eventForm.value.date),
      photos: this.uploadedPhotos
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

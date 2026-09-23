import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SignalementService } from '../../../core/services/signalement.service';
import { ObservationService } from '../../../core/services/observation.service';
import { Observation } from '../../../core/models/observation.model';
import { SignalementPayload } from '../../../core/models/signalement.model';
import { uniqueEmailValidator } from '../../../core/validators/unique-email.validator';
import { maxAgeValidator } from '../../../core/validators/max-age.validators';

@Component({
  selector: 'app-signalement-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signalement-form.template.html',
  styleUrl: './signalement-form.scss',
})
export class SignalementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private signalementService = inject(SignalementService);
  private observationService = inject(ObservationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  signalementId: number | null = null;
  availableObservations: Observation[] = [];
  isLoading = false;
  isSubmitting = false;

  form: FormGroup = this.fb.group({
    author: this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      birth_date: ['', [Validators.required, maxAgeValidator(100)]],
      sex: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }),
    description: ['', Validators.required],
    observations: [[] as number[]],
  });

  ngOnInit(): void {
    this.isLoading = true;

    const idParam = this.route.snapshot.paramMap.get('id');
    this.signalementId = idParam ? Number(idParam) : null;


    this.form
      .get('author.email')!
      .setAsyncValidators(uniqueEmailValidator(this.signalementService, this.signalementId));

    this.observationService.getAll().subscribe({
      next: (obs) => (this.availableObservations = obs),
      error: () =>
        this.snackBar.open('Impossible de charger les observations.', 'Fermer', { duration: 4000 }),
    });

    if (this.signalementId) {
      this.signalementService.getById(this.signalementId).subscribe({
        next: (signalement) => {
          this.form.patchValue({
            author: signalement.author,
            description: signalement.description,
            observations: signalement.observations.map((o) => o.id),
          });
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Signalement introuvable.', 'Fermer', { duration: 4000 });
          this.router.navigate(['/signalements']);
        },
      });
    } else {
      this.isLoading = false;
    }
  }

  get selectedObservationIds(): number[] {
    return this.form.get('observations')?.value ?? [];
  }

  get filteredObservations(): Observation[] {
    const selected = this.selectedObservationIds;
    return this.availableObservations.filter((o) => !selected.includes(o.id));
  }

  getObservationName(id: number): string {
    return this.availableObservations.find((o) => o.id === id)?.name ?? '';
  }

  addObservation(event: MatAutocompleteSelectedEvent): void {
    const id = event.option.value as number;
    const current = this.selectedObservationIds;
    if (!current.includes(id)) {
      this.form.get('observations')!.setValue([...current, id]);
    }
  }

  removeObservation(id: number): void {
    const current = this.selectedObservationIds;
    this.form.get('observations')!.setValue(current.filter((o) => o !== id));
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: SignalementPayload = this.form.value;
    console.log('payload : ', payload);

    const request$ = this.signalementId
      ? this.signalementService.update(this.signalementId, payload)
      : this.signalementService.create(payload);

    request$.subscribe({
      next: () => {
        this.snackBar.open('Signalement enregistré avec succès.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/signalements']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (err.status === 400 && err.error?.author?.email) {
          this.form.get('author.email')!.setErrors({ emailTaken: true });
        } else {
          this.snackBar.open("Une erreur est survenue lors de l'enregistrement.", 'Fermer', {
            duration: 4000,
          });
        }
      },
    });
  }
}

import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, catchError, of, debounceTime, switchMap, first } from 'rxjs';
import { SignalementService } from '../services/signalement.service';

export function uniqueEmailValidator(
  signalementService: SignalementService,
  currentSignalementId: number | null,
): AsyncValidatorFn {
  return (control: AbstractControl): ReturnType<AsyncValidatorFn> => {
    if (!control.value) return of(null);

    return of(control.value).pipe(
      debounceTime(400),
      switchMap((email) =>
        signalementService.getAll().pipe(
          map((signalements) => {
            const emailExists = signalements.some(
              (s) => s.author.email === email && s.id !== currentSignalementId,
            );
            return emailExists ? ({ emailTaken: true } as ValidationErrors) : null;
          }),
          catchError(() => of(null)),
        ),
      ),
      first(),
    );
  };
}

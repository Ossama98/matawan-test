import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isFormValidationError = error.status === 400 && !!error.error?.author;

      if (!isFormValidationError) {
        const message = getErrorMessage(error);
        snackBar.open(message, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }

      return throwError(() => error);
    }),
  );
};

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
  }
  if (error.status === 404) {
    return 'La ressource demandée est introuvable.';
  }
  if (error.status >= 500) {
    return 'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
  }
  return 'Une erreur inattendue est survenue.';
}

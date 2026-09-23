import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxAgeValidator(maxYears: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const limitDate = new Date();
    limitDate.setFullYear(limitDate.getFullYear() - maxYears);

    return birthDate < limitDate ? { maxAge: { max: maxYears } } : null;
  };
}

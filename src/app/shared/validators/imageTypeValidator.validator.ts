import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function imageTypeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const file = control.value;
  if (file) {
    const mimeType = file.type;
    if (mimeType && !mimeType.startsWith('image/')) {
      return { invalidImage: true };
    }
  }
  return null;
}

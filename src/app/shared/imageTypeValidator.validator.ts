import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function imageTypeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const file = control.value;
  if (file) {
    const mimeType = file.type;
    if (!mimeType.startsWith('image/')) {
      return { invalidImage: true };
    } else {
      return null;
    }
  }
  return null;
}

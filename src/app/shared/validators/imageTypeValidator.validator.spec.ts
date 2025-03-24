import { imageTypeValidator } from './imageTypeValidator.validator'; // Ajusta la ruta según sea necesario
import { AbstractControl } from '@angular/forms';

describe('imageTypeValidator', () => {
  it('should return null for a valid image file (e.g., image/png)', () => {
    const control = { value: { type: 'image/png' } } as AbstractControl;
    const result = imageTypeValidator(control);
    expect(result).toBeNull();
  });

  it('should return an error object for an invalid image file (e.g., text/plain)', () => {
    const control = { value: { type: 'text/plain' } } as AbstractControl;
    const result = imageTypeValidator(control);
    expect(result).toEqual({ invalidImage: true });
  });

  it('should return null for an empty control value', () => {
    const control = { value: null } as AbstractControl;
    const result = imageTypeValidator(control);
    expect(result).toBeNull();
  });

  it('should return null for a control value with an empty file object', () => {
    const control = { value: {} } as AbstractControl;
    const result = imageTypeValidator(control);
    expect(result).toBeNull();
  });
});

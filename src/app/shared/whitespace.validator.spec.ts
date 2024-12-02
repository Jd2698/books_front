// validators/no-whitespace.validator.spec.ts
import { noWhitespaceValidator } from './whitespace.validator';
import { AbstractControl } from '@angular/forms';

describe('noWhitespaceValidator', () => {
  it('should return null if the control value is valid (non-whitespace)', () => {
    const control: AbstractControl = { value: 'valid text' } as AbstractControl;
    const result = noWhitespaceValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object if the control value is only whitespace', () => {
    const control: AbstractControl = { value: '   ' } as AbstractControl;
    const result = noWhitespaceValidator()(control);
    expect(result).toEqual({ whitespace: true });
  });

  it('should return null if the control value is an empty string', () => {
    const control: AbstractControl = { value: '' } as AbstractControl;
    const result = noWhitespaceValidator()(control);
    expect(result).toBeNull()
  });
});

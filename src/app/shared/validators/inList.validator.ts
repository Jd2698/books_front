import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function inList(arrayValues: any[]): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (control.value && !arrayValues.includes(control.value)) {
			return { inList: true }
		}
		return null
	}
}

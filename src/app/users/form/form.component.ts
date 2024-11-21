import { NgClass, NgIf } from '@angular/common'
import {
	Component,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output
} from '@angular/core'
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { UsersService } from '../services/users.service'
import { noWhitespaceValidator } from '../../shared/whitespace.validator'

@Component({
	selector: 'app-form',
	standalone: true,
	imports: [ButtonModule, ReactiveFormsModule, NgIf],
	templateUrl: './form.component.html',
	styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
	@Input() userSelected!: any

	@Output() toggleDialog = new EventEmitter<void>()
	@Output() loadUsers = new EventEmitter<void>()
	@Output() showToast = new EventEmitter<{
		severity: string
		summary: string
		details: string
		life: number
	}>()

	formGroup!: FormGroup
	private _userService = inject(UsersService)
	constructor(private _formBuild: FormBuilder) {
		this.formGroup = _formBuild.group({
			name: ['', [Validators.required, noWhitespaceValidator()]],
			email: ['', [Validators.required, Validators.email]],
			telefono: [null, Validators.pattern(/^\d{10}$/)]
		})
	}

	ngOnInit(): void {
		if (this.userSelected) {
			this.formGroup.setValue({
				name: this.userSelected.name,
				email: this.userSelected.email,
				telefono: this.userSelected.telefono
			})
		}
	}

	runDialogEmitter() {
		this.toggleDialog.emit()
	}

	hasError(data: { field: string; error: string }) {
		const control = this.formGroup.controls[data.field]

		const error = control.errors?.[data.error]
		const isTouched = control.touched || control.dirty

		return error && isTouched
	}

	resetFormGroup(): void {
		this.formGroup.reset()
	}

	submit(): void {
		const telefono = this.formGroup.controls['telefono'].value.trim() || null
		const data = { ...this.userSelected, ...this.formGroup.value, telefono }

		//para actualizar y crear
		if (this.userSelected) {
			this._userService.update(this.userSelected.id, data).subscribe({
				next: response => {
					this.resetFormGroup()
					this.loadUsers.emit()

					this.showToast.emit({
						severity: 'success',
						summary: 'user updated',
						details: 'The user has been updated.',
						life: 3000
					})
				},
				error: error => {
					console.error('Error updating user', error)
					this.showToast.emit({
						severity: 'error',
						summary: 'Error updating user.',
						details: 'The user could not be updated.',
						life: 3000
					})
				}
			})
		} else {
			this._userService.create(data).subscribe({
				next: response => {
					this.resetFormGroup()
					this.loadUsers.emit()

					this.showToast.emit({
						severity: 'success',
						summary: 'New user added',
						details: 'The user has been added.',
						life: 3000
					})
				},
				error: error => {
					console.error('Error fetching users', error)
					this.showToast.emit({
						severity: 'error',
						summary: 'Error creating user.',
						details: 'The user could not be created.',
						life: 3000
					})
				}
			})
		}
	}
}

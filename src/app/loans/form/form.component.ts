import { Component, inject, OnInit } from '@angular/core'
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators
} from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { LoansService } from '../services/loans.service'
import { noWhitespaceValidator } from '../../shared/whitespace.validator'
import { NgIf } from '@angular/common'
import { DropdownModule } from 'primeng/dropdown'
import { userModel } from '../../users/model/user.model'
import { UsersService } from '../../users/services/users.service'
import { CalendarModule } from 'primeng/calendar'

@Component({
	selector: 'app-form',
	standalone: true,
	imports: [ButtonModule, ReactiveFormsModule, DropdownModule, CalendarModule],
	templateUrl: './form.component.html',
	styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
	//
	minDate: Date = new Date()
	users!: userModel[]
	formGroup!: FormGroup
	private _loanService = inject(LoansService)
	private _userService = inject(UsersService)

	constructor(private _formBuild: FormBuilder) {
		this.formGroup = _formBuild.group({
			usuarioId: [null, [Validators.required]],
			fechaPrestamo: [null, [Validators.required]],
			fechaDevolucion: [null, [Validators.required]]
		})
	}

	ngOnInit(): void {
		this._userService.getAll().subscribe({
			next: response => {
				this.users = response
				console.log(this.users)
			}
		})
	}

	hasError(data: { field: string; error: string }) {
		const control = this.formGroup.controls[data.field]

		const error = control.errors?.[data.error]
		const isTouched = control.touched || control.dirty

		return error && isTouched
	}

	submit() {
		this._loanService.create(this.formGroup.value).subscribe()
		console.log(this.formGroup.value)
	}
}

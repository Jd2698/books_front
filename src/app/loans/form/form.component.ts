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
import { LoansService } from '../services/loans.service'
import { NgIf } from '@angular/common'
import { DropdownModule } from 'primeng/dropdown'
import { UsersService } from '../../users/services/users.service'
import { CalendarModule } from 'primeng/calendar'
import { BooksService } from '../../books/books.service'
import { Iuser } from '../../users/model/user.model'
import { Iloan } from '../model/loan.model'

@Component({
	selector: 'app-form',
	standalone: true,
	imports: [
		ButtonModule,
		ReactiveFormsModule,
		DropdownModule,
		CalendarModule,
		NgIf
	],
	templateUrl: './form.component.html',
	styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
	@Input() loanSelected!: Iloan

	@Output() toggleDialog = new EventEmitter<void>()
	@Output() loadLoans = new EventEmitter<void>()
	@Output() showToast = new EventEmitter<{
		severity: string
		summary: string
		details: string
		life: number
	}>()

	minDate: Date = new Date()
	LoanDate!: Date
	users!: Iuser[]
	books!: any
	enableDate: boolean = false
	formGroup!: FormGroup
	private _loanService = inject(LoansService)
	private _userService = inject(UsersService)
	private _bookService = inject(BooksService)
	private _formBuild = inject(FormBuilder)

	ngOnInit(): void {
		this.setFormGroup()
		this.loadUsersAndBooks()
	}

	setFormGroup() {
		if (this.loanSelected) {
			this.formGroup = this._formBuild.group({
				entregado: [this.loanSelected.entregado, Validators.required]
			})
		} else {
			this.formGroup = this._formBuild.group({
				usuarioId: [null, [Validators.required]],
				libroId: [null, [Validators.required]],
				fechaPrestamo: [null, [Validators.required]],
				fechaDevolucion: [
					{ value: null, disabled: true },
					[Validators.required]
				]
			})
		}

		// habilitar el input y setear loandate
		this.formGroup.get('fechaPrestamo')?.valueChanges.subscribe({
			next: v => {
				if (this.formGroup.get('fechaPrestamo')?.valid) {
					this.LoanDate = this.formGroup.get('fechaPrestamo')?.value
					this.formGroup.get('fechaDevolucion')?.enable()
				}
			}
		})
	}

	loadUsersAndBooks() {
		this._userService.getAll().subscribe({
			next: response => {
				this.users = response
			}
		})
		this._bookService.getAll().subscribe({
			next: response => {
				this.books = response
			}
		})
	}

	runDialogEmitter() {
		this.toggleDialog.emit()
	}

	hasError(data: { field: string; error: string }) {
		const control = this.formGroup.controls[data.field]
		if (!control) return false

		const error = control.errors?.[data.error]
		const isTouched = control.touched || control.dirty

		return error && isTouched
	}

	resetFormGroup() {
		this.formGroup.reset()
	}

	submit() {
		if (this.loanSelected) {
			this._loanService
				.update(this.loanSelected.id, this.formGroup.value)
				.subscribe({
					next: response => {
						// this.resetFormGroup()
						this.runDialogEmitter()
						this.loadLoans.emit()

						this.showToast.emit({
							severity: 'success',
							summary: 'loan updated',
							details: 'The loan has been updated.',
							life: 3000
						})
					},
					error: error => {
						console.error('Error updating loan', error)
						this.showToast.emit({
							severity: 'error',
							summary: 'Error updating loan.',
							details: 'The loan could not be updated.',
							life: 3000
						})
					}
				})
		} else {
			this._loanService.create(this.formGroup.value).subscribe({
				next: response => {
					this.resetFormGroup()
					this.loadLoans.emit()

					this.showToast.emit({
						severity: 'success',
						summary: 'New loan added',
						details: 'The loan has been added.',
						life: 3000
					})
				},
				error: error => {
					console.log('error creating loan ', error)
					this.showToast.emit({
						severity: 'error',
						summary: 'Error creating loan.',
						details: 'The loan could not be updated.',
						life: 3000
					})
				}
			})
		}
	}
}

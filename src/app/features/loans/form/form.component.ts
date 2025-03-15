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
import { LoansService } from '../services/loans.service'
import { UsersService } from '../../users/services/users.service'
import { BooksService } from '../../books/services/books.service'
import { Iuser } from '../../users/model/user.model'
import { Iloan } from '../model/loan.model'
import { Ibook } from '../../books/model/book.model'
import { EstadoEntregado } from '../../books/enums/estadoEntregado.enum'
import { inList } from '../../../shared/inList.validator'

@Component({
	selector: 'app-form',
	standalone: true,
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './form.component.html',
	styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
	@Input() selectedLoan?: Iloan

	@Output() toggleModalVisibility = new EventEmitter<void>()
	@Output() refreshLoans = new EventEmitter<void>()
	@Output() showToast = new EventEmitter<{
		severity: string
		summary: string
		details: string
		life: number
	}>()

	disableReturnedOptions: boolean = false
	statusOptions = Object.values(EstadoEntregado).map(value => {
		return { value }
	})

	statusOptionsArray = Object.values(EstadoEntregado)

	minLoanDate: Date = new Date()
	LoanDate!: Date

	users!: Iuser[]
	books!: Ibook[]
	formGroup!: FormGroup

	private _loanService = inject(LoansService)
	private _userService = inject(UsersService)
	private _bookService = inject(BooksService)
	private _formBuild = inject(FormBuilder)

	ngOnInit(): void {
		this.initializeForm()
		this.loadUsersAndBooks()
	}

	initializeForm(): void {
		if (this.selectedLoan) {
			this.formGroup = this._formBuild.group({
				estado: [
					this.selectedLoan.estado,
					[Validators.required, inList(this.statusOptionsArray)]
				]
			})

			// deshabilitar input entregado
			if (this.selectedLoan.estado == EstadoEntregado.DEVUELTO) {
				this.formGroup.get('estado')?.disable()
			}
		} else {
			this.formGroup = this._formBuild.group({
				usuarioId: [null, [Validators.required]],
				libroId: [null, [Validators.required]],
				fechaPrestamo: [null, [Validators.required]],
				fechaDevolucion: [
					{ value: null, disabled: true },
					[Validators.required]
				],
				estado: [EstadoEntregado.PENDIENTE, [inList(this.statusOptionsArray)]]
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

	loadUsersAndBooks(): void {
		this._userService.getAll().subscribe({
			next: (response: Iuser[]) => {
				this.users = response
			}
		})
		this._bookService.getAll().subscribe({
			next: (response: Ibook[]) => {
				this.books = response.map(v => {
					return { ...v, deshabilitar: !v.disponible }
				})
			}
		})
	}

	emitModalToggle(): void {
		this.toggleModalVisibility.emit()
	}

	hasError(data: { field: string; error: string }): boolean {
		const control = this.formGroup.controls[data.field]
		if (!control) return false

		const error = control.errors?.[data.error]
		const isTouchedOrDirty = control.touched || control.dirty

		return error && isTouchedOrDirty
	}

	resetFormGroup(): void {
		this.formGroup.reset()
	}

	submit() {
		// actualizar y crear
		if (this.selectedLoan) {
			this._loanService
				.update(this.selectedLoan.id, this.formGroup.value)
				.subscribe({
					next: response => {
						// this.resetFormGroup()
						this.emitModalToggle()
						this.refreshLoans.emit()

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
					// this.resetFormGroup()
					this.emitModalToggle()
					this.refreshLoans.emit()

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

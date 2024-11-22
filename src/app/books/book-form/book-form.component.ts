import { DatePipe, NgClass, NgIf } from '@angular/common'
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
import { noWhitespaceValidator } from '../../shared/whitespace.validator'
import { BooksService } from '../books.service'
import { InputTextareaModule } from 'primeng/inputtextarea'

@Component({
	selector: 'app-book-form',
	standalone: true,
	imports: [ButtonModule, ReactiveFormsModule, NgIf, InputTextareaModule],
	templateUrl: './book-form.component.html',
	styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
	@Input() bookSelected!: any

	@Output() toggleDialog = new EventEmitter<void>()
	@Output() loadBooks = new EventEmitter<void>()
	@Output() showToast = new EventEmitter<{
		severity: string
		summary: string
		details: string
		life: number
	}>()

	formGroup!: FormGroup
	private _booksService = inject(BooksService)
	constructor(private _formBuild: FormBuilder) {
		this.formGroup = _formBuild.group({
			titulo: ['', [Validators.required]],
			fechaPublicacion: ['', [Validators.required]],
			genero: ['', Validators.required],
			numPaginas: [null, [Validators.required, Validators.min(0)]],
			resumen: ['', Validators.required],
			autor: ['', Validators.required],
			stock_disponible: [null, [Validators.required, Validators.min(0)]]
		})
	}

	ngOnInit(): void {
		if (this.bookSelected) {
			this.formGroup.setValue({
				titulo: this.bookSelected.titulo,
				fechaPublicacion: this.bookSelected.fechaPublicacion,
				genero: this.bookSelected.genero,
				numPaginas: this.bookSelected.numPaginas,
				resumen: this.bookSelected.resumen,
				autor: this.bookSelected.autor,
				stock_disponible: this.bookSelected.stock_disponible
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
	formatDate() {
		const control = this.formGroup.get('fechaPublicacion')
		if (control?.value) {
			const formatted = new Date(control.value)
			control.setValue(formatted.toISOString())
		}
	}

	submit(): void {
		//para actualizar y crear
		if (this.bookSelected) {
			this._booksService
				.update(this.bookSelected.id, this.formGroup.value)
				.subscribe({
					next: response => {
						this.resetFormGroup()
						this.loadBooks.emit()
						this.showToast.emit({
							severity: 'success',
							summary: 'Book updated',
							details: 'The book has been updated.',
							life: 3000
						})
					},
					error: error => {
						console.error('Error updating book', error)
						this.showToast.emit({
							severity: 'error',
							summary: 'Error updating book.',
							details: 'The book could not be updated.',
							life: 3000
						})
					}
				})
		} else {
			this._booksService.create(this.formGroup.value).subscribe({
				next: response => {
					this.resetFormGroup()
					this.loadBooks.emit()

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

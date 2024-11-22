import { Component, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { TableModule } from 'primeng/table'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ToastModule } from 'primeng/toast'
import { DatePipe, NgFor, NgIf } from '@angular/common'
import { ConfirmationService, MessageService } from 'primeng/api'
import { BooksService } from './services/books.service'
import { BookFormComponent } from './form/book-form.component'
import { Ibook } from './model/book.model'
import { FormsModule } from '@angular/forms'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [
		TableModule,
		DialogModule,
		ButtonModule,
		BookFormComponent,
		ConfirmPopupModule,
		ToastModule,
		NgIf,
		NgFor,
		DatePipe,
		FormsModule,
		InputIconModule
	],
	templateUrl: './books.component.html',
	styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
	searchKeyword = ''
	headersTable: any[] = [
		{ label: 'Titulo', value: 'titulo' },
		{ label: 'Autor', value: 'autor' },
		{ label: 'Genero', value: 'genero' },
		{ label: 'Fecha de Publicacion', value: 'fechaPublicacion' },
		{ label: 'Número de Paginas', value: 'numPaginas' },
		{ label: 'Stock Disponible', value: 'stock_disponible' }
	]

	books!: Ibook[]
	isModalVisible: boolean = false
	selectedBook?: Ibook

	constructor(
		private _bookService: BooksService,
		private confirmationService: ConfirmationService,
		private messageService: MessageService
	) {}

	ngOnInit(): void {
		this.loadBooks()
	}

	loadBooks(): void {
		this._bookService.getAll().subscribe({
			next: (response: Ibook[]) => {
				this.books = response
			},
			error: error => {
				console.error('Error fetching books:', error)
			}
		})
	}

	toggleModalVisibility() {
		this.selectedBook = undefined
		this.isModalVisible = !this.isModalVisible
	}

	setSelectedBook(book: any) {
		this.toggleModalVisibility()
		this.selectedBook = book
	}

	confirmDelete(event: Event, bookId: number) {
		this.confirmationService.confirm({
			target: event.target as EventTarget,
			message: 'Do you want to delete this record?',
			icon: 'pi pi-info-circle',
			acceptButtonStyleClass: 'py-1 px-2 bg-red-700 text-white',
			rejectButtonStyleClass: 'py-1 px-2',
			accept: () => {
				this.deleteBook(bookId)
			}
		})
	}

	deleteBook(id: number): void {
		this._bookService.delete(id).subscribe({
			next: response => {
				this.showToast({
					severity: 'success',
					summary: 'Book removed',
					details: 'The book has been removed.',
					life: 4000
				})
				this.loadBooks()
			},
			error: error => console.log('Error deleting book', error)
		})
	}

	showToast(data: {
		severity: string
		summary: string
		details: string
		life: number
	}) {
		this.messageService.add({
			severity: data.severity,
			summary: data.summary,
			detail: data.details,
			life: data.life
		})
	}
}

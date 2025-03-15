import { Component, OnInit } from '@angular/core'
import { DatePipe, NgFor, NgIf } from '@angular/common'
import { BooksService } from './services/books.service'
import { BookFormComponent } from './form/book-form.component'
import { Ibook } from './model/book.model'
import { FormsModule } from '@angular/forms'

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [BookFormComponent, NgIf, NgFor, DatePipe, FormsModule],
	templateUrl: './books.component.html',
	styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
	searchKeyword = ''
	headersTable: any[] = [
		{ label: 'Titulo', value: 'titulo' },
		{ label: 'Autor', value: 'autor' },
		{ label: 'Genero', value: 'genero' },
		{ label: 'Número de Libros', value: 'numLibros' },
		{ label: 'Disponible', value: 'disponible' }
	]

	books!: Ibook[]
	isModalVisible: boolean = false
	selectedBook?: Ibook

	constructor(private _bookService: BooksService) {}

	ngOnInit(): void {
		this.loadBooks()
	}

	loadBooks(): void {
		this._bookService.getAll().subscribe({
			next: (response: Ibook[]) => {
				this.books = response
			},
			error: error => {}
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

	confirmDelete(event: Event, bookId: number) {}

	deleteBook(id: number): void {
		this._bookService.delete(id).subscribe({
			next: response => {
				this.loadBooks()
			},
			error: error => {}
		})
	}
}

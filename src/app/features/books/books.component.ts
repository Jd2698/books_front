import { Component, OnInit } from '@angular/core'
import { DatePipe, NgFor, NgIf } from '@angular/common'
import { BooksService } from './services/books.service'
import { BookFormComponent } from './pages/form/book-form.component'
import { IBook } from './models/book.model'
import { FormsModule } from '@angular/forms'
import { CardComponent } from './components/card/card.component'

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [NgFor, FormsModule, CardComponent],
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

	books!: IBook[]
	isModalVisible: boolean = false
	selectedBook?: IBook

	constructor(private _bookService: BooksService) {}

	ngOnInit(): void {
		this.loadBooks()
	}

	loadBooks(): void {
		this._bookService.getAll().subscribe({
			next: (response: IBook[]) => {
				this.books = response
				console.log(response)
			},
			error: error => {}
		})
	}

	trackById(index: number, book: IBook): number {
		return book.id
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

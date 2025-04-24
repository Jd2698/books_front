import { Component, OnInit } from '@angular/core'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'
import { BooksService } from './services/books.service'
import { IBook } from './models/book.model'
import { FormsModule } from '@angular/forms'
import { CardComponent } from './components/card/card.component'
import { Store } from '@ngrx/store'
import { initItems } from '../../core/ngrx/actions/books.actions'
import { Observable } from 'rxjs'
import { selectAllBooks } from '../../core/ngrx/selectors/book.selector'

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [NgFor, NgIf, FormsModule, CardComponent, AsyncPipe],
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

	books$!: Observable<IBook[]>
	isModalVisible: boolean = false
	selectedBook?: IBook

	constructor(
		private _bookService: BooksService,
		private readonly _store: Store<{ books: IBook[] }>
	) {}

	ngOnInit(): void {
		this.books$ = this._store.select(selectAllBooks)
		this.books$.subscribe(res => {
			if (!res || res.length == 0) {
				this.loadBooks()
				console.log('with loadbooks method')
			}
		})
	}

	addItemsToStore(data: IBook[]) {
		this._store.dispatch(initItems({ data }))
	}

	loadBooks(): void {
		this._bookService.getAll().subscribe({
			next: (response: IBook[]) => {
				this.addItemsToStore(response)
			},
			error: error => console.log('Error getting books: ', error)
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

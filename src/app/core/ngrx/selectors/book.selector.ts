import { createSelector } from '@ngrx/store'
import { IBook } from '../../../features/books/models/book.model'

export const selectBooksState = (state: { books: IBook[] }) => state.books

export const selectAllBooks = createSelector(
	selectBooksState,
	(state: IBook[]) => state
)

export const selectBookById = (id: number) =>
	createSelector(selectBooksState, (books: IBook[]) =>
		books.find(book => book.id === id)
	)

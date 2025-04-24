import { createReducer, on } from '@ngrx/store'
import {
	addItems,
	initItems,
	removeItem,
	reset
} from '../actions/books.actions'
import { IBook } from '../../../features/books/models/book.model'

export const initialState: IBook[] = []

export const booksReducer = createReducer(
	initialState,
	on(initItems, (state, { data }) => [...data]),
	on(addItems, (state, { book }) => [...state, book]),
	on(removeItem, (state, { id }) => state.filter((t: IBook) => t.id !== id)),
	on(reset, state => [])
)

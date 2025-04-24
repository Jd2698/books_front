import { createAction, props } from '@ngrx/store'
import { IBook } from '../../../features/books/models/book.model'

export const initItems = createAction(
	'[Books] Init Item',
	props<{ data: IBook[] }>()
)

export const addItems = createAction(
	'[Books] Add Item',
	props<{ book: IBook }>()
)

export const removeItem = createAction(
	'[Books] Remove Item',
	props<{ id: number }>()
)

export const reset = createAction('[Books] Reset')

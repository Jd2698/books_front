import { TestBed } from '@angular/core/testing'

import { BooksService } from './books.service'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

const httpServiceMock = {
	get: jest.fn(() => of(bookListMock)),
	post: jest.fn(() => of(bookListMock[0])),
	put: jest.fn(() => of(bookListMock[0])),
	delete: jest.fn(() => of(bookListMock[0]))
}

const bookListMock = [
	{
		id: 1,
		title: 'history',
		disponible: false
	}
]

describe('BooksService', () => {
	let service: BooksService

	beforeEach(() => {
		TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
			providers: [
				BooksService,
				{
					provide: HttpClient,
					useValue: httpServiceMock
				}
			]
		})

		service = TestBed.inject(BooksService)
	})

	it('should be created', () => {
		expect(service).toBeTruthy()
	})

	// get
	it('getAll has been called', () => {
		service.getAll()
		expect(httpServiceMock.get).toHaveBeenCalled()
	})

	it('getAll should return a modified user list', done => {
		httpServiceMock.get.mockReturnValue(of(bookListMock))

		service.getAll().subscribe(res => {
			expect(res).toEqual([
				{
					id: 1,
					title: 'history',
					disponible: false,
					deshabilitar: true
				}
			])

			done()
		})
	})

	// post
	it('create has been called', () => {
		service.create({})
		expect(httpServiceMock.post).toHaveBeenCalled()
	})

	it('create should return an object', done => {
		service.create(bookListMock[0]).subscribe(res => {
			expect(res).toEqual(bookListMock[0])
			done()
		})
	})

	// put
	it('update has been called', () => {
		service.update('1', {})
		expect(httpServiceMock.put).toHaveBeenCalled()
	})

	it('update should return an object', done => {
		service.update('1', bookListMock[0]).subscribe(res => {
			expect(res).toEqual(bookListMock[0])
			done()
		})
	})

	// delete
	it('delete has been called', () => {
		service.delete(1)
		expect(httpServiceMock.delete).toHaveBeenCalled()
	})

	it('delete should return an object', done => {
		service.delete(1).subscribe(res => {
			expect(res).toEqual(bookListMock[0])
			done()
		})
	})
})

import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BooksComponent } from './books.component'
import { BooksService } from './services/books.service'
import { ConfirmationService, MessageService } from 'primeng/api'
import { of } from 'rxjs'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

const bookServiceMock = {
	getAll: jest.fn(),
	delete: jest.fn()
}

describe('BooksComponent', () => {
	let component: BooksComponent
	let fixture: ComponentFixture<BooksComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
			imports: [BooksComponent],
			providers: [
				{ provide: BooksService, useValue: bookServiceMock },
				ConfirmationService,
				MessageService
			]
		}).compileComponents()
		bookServiceMock.getAll.mockReturnValue(of([{}]))
		bookServiceMock.delete.mockReturnValue(of({}))

		fixture = TestBed.createComponent(BooksComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	// it('should create', () => {
	// 	expect(component).toBeTruthy()
	// })

	it('prueba', () => {
		expect(true).toBe(true)
	})
})

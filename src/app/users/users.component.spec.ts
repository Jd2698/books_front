import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UsersComponent } from './users.component'
import { UsersService } from './services/users.service'
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api'
import { of, pipe } from 'rxjs'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

const userServiceMock = {
	getAll: jest.fn(() => of([updateUserDataMock])),
	delete: jest.fn(() => of(userDataMock))
}

const userDataMock = {
	id: 1,
	nombre: 'martha',
	image: 'image/photo.jgp'
}

const updateUserDataMock = {
	id: 1,
	nombre: 'martha',
	image: 'http://localhost:3000/images/image/photo.jgp'
}

const confirmationServiceMock = {
	requireConfirmation$: of(),
	accept: of(),

	confirm: jest.fn().mockImplementation(options => {
		options.accept()
	}),
	close: jest.fn().mockReturnThis(),
	onAccept: jest.fn()
}

describe('UsersComponent', () => {
	let component: UsersComponent
	let fixture: ComponentFixture<UsersComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
			imports: [UsersComponent],
			providers: [
				{ provide: UsersService, useValue: userServiceMock },
				{ provide: ConfirmationService, useValue: confirmationServiceMock },
				MessageService,
				pipe
			]
		}).compileComponents()

		fixture = TestBed.createComponent(UsersComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	it('loadUsers has been called in onInit', () => {
		component.ngOnInit()
		expect(userServiceMock.getAll).toHaveBeenCalled()
	})

	it('should call delete', () => {
		component.deleteUser(1)
		expect(userServiceMock.delete).toHaveBeenCalled()
	})

	it('should call deleteUser when confirmation is accepted', () => {
		const deleteUserMock = jest.spyOn(component, 'deleteUser')

		const mockEvent = {
			target: {}
		} as Event

		const userId = 2

		confirmationServiceMock.confirm

		component.confirmDelete(mockEvent, userId)

		expect(deleteUserMock).toHaveBeenCalledWith(userId)
	})
})

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { UsersService } from './services/users.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, pipe, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

// npx jest src/app/users/users.component.spec.ts

const userDataMock = {
  id: 1,
  nombre: 'martha',
  imagen: 'image/photo.jgp',
};

const userServiceMock = {
  getAll: jest.fn(() => of([userDataMock])),
  delete: jest.fn(() => of(userDataMock)),
};

const confirmationServiceMock = {
  requireConfirmation$: of(),
  accept: of(),

  confirm: jest.fn().mockImplementation((options) => {
    options.accept();
  }),
  close: jest.fn().mockReturnThis(),
  onAccept: jest.fn(),
};

const messageServiceMock = {
  messageObserver: of(),
  clearObserver: of(),
  add: jest.fn(),
};

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [UsersComponent],
      providers: [
        { provide: UsersService, useValue: userServiceMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        pipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleModalVisibility has been called in setSelectedBook', () => {
    const toggleModalVisibilitySpy = jest.spyOn(
      component,
      'toggleModalVisibility'
    );
    component.setSelectedUser({
      id: 20,
      nombre: 'carlos',
      email: 'carlgos@gmail.com',
    });
    expect(toggleModalVisibilitySpy).toHaveBeenCalled();
  });

  it('loadUsers has been called in onInit', () => {
    const loadUsersSpy = jest.spyOn(component, 'loadUsers');
    component.ngOnInit();
    expect(loadUsersSpy).toHaveBeenCalled();
  });

  it('should call getAll and map users with the image URL', () => {
    component.loadUsers();
    expect(component.users).toEqual([
      {
        id: 1,
        nombre: 'martha',
        imagen: 'image/photo.jgp',
        urlImagen: `${component.URLHOST}image/photo.jgp`,
      },
    ]);
  });

  it('should call getAll and map users with URL not found', () => {
    userServiceMock.getAll.mockReturnValue(
      of([{ ...userDataMock, imagen: '' }])
    );

    component.loadUsers();
    expect(component.users).toEqual([
      {
        ...userDataMock,
        imagen: "",
        urlImagen: 'not found',
      },
    ]);
  });

  it('should call delete', () => {
    component.deleteUser(1);
    expect(userServiceMock.delete).toHaveBeenCalled();
  });

  it('should call deleteUser when confirmation is accepted', () => {
    const deleteUserSpy = jest.spyOn(component, 'deleteUser');

    const mockEvent = {
      target: {},
    } as Event;

    const userId = 2;

    confirmationServiceMock.confirm;

    component.confirmDelete(mockEvent, userId);

    expect(deleteUserSpy).toHaveBeenCalledWith(userId);
  });

  it('should handle error when getAll() fails', () => {
    const showToastSpy = jest.spyOn(component, 'showToast');

    userServiceMock.getAll.mockReturnValue(throwError(() => new Error()));

    component.loadUsers();

    expect(showToastSpy).toHaveBeenCalledWith({
      details: 'error',
      life: 2000,
      severity: 'error',
      summary: 'danger',
    });
  });

  it('should handle error when deleteuser() fails', () => {
    const showToastSpy = jest.spyOn(component, 'showToast');

    userServiceMock.delete.mockReturnValue(throwError(() => new Error()));

    component.deleteUser(20);

    expect(showToastSpy).toHaveBeenCalledWith({
      details: 'error',
      life: 2000,
      severity: 'error',
      summary: 'danger',
    });
  });
});

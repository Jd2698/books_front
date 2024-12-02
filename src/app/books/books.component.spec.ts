import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksComponent } from './books.component';
import { BooksService } from './services/books.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

//sudo npx jest src/app/books/books.component.spec.ts

const bookServiceMock = {
  getAll: jest.fn(),
  delete: jest.fn(),
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

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [BooksComponent],
      providers: [
        { provide: BooksService, useValue: bookServiceMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();
    bookServiceMock.getAll.mockReturnValue(of([{}]));
    bookServiceMock.delete.mockReturnValue(of({}));

    fixture = TestBed.createComponent(BooksComponent);
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
    component.setSelectedBook({});
    expect(toggleModalVisibilitySpy).toHaveBeenCalled();
  });

  it('loadBooks has been called in onInit', () => {
    const loadBooksSpy = jest.spyOn(component, 'loadBooks');
    component.ngOnInit();

    expect(loadBooksSpy).toHaveBeenCalled();
  });

  it('getAll has been called in loadUsers', () => {
    component.loadBooks;

    expect(bookServiceMock.getAll).toHaveBeenCalled();
  });

  it('should handle error when getAll() fails', () => {
    const showToastSpy = jest.spyOn(component, 'showToast');

    bookServiceMock.getAll.mockReturnValue(
      throwError(() => new Error())
    );

    component.loadBooks();

    expect(showToastSpy).toHaveBeenCalledWith({
      details: 'error',
      life: 2000,
      severity: 'error',
      summary: 'danger',
    });
  });

	it('should handle error when deleteBook() fails', () => {
    const showToastSpy = jest.spyOn(component, 'showToast');

    bookServiceMock.delete.mockReturnValue(
      throwError(() => new Error())
    );

    component.deleteBook(10);

    expect(showToastSpy).toHaveBeenCalledWith({
      details: 'error',
      life: 2000,
      severity: 'error',
      summary: 'danger',
    });
  });

  it('delete has been called in deleteBook', () => {
    component.deleteBook(1);

    expect(bookServiceMock.delete).toHaveBeenCalled();
  });

  it('should call deleteUser when confirmation is accepted', () => {
    const deleteBookSpy = jest.spyOn(component, 'deleteBook');

    const mockEvent = {
      target: {},
    } as Event;

    const userId = 3;

    confirmationServiceMock.confirm;

    component.confirmDelete(mockEvent, userId);

    expect(deleteBookSpy).toHaveBeenCalledWith(userId);
  });
});

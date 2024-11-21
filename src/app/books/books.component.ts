import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { FormComponent } from '../users/form/form.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { NgFor, NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BooksService } from './books.service';
import { BookFormComponent } from './book-form/book-form.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    BookFormComponent,
    ConfirmPopupModule,
    ToastModule,
    NgIf,
    NgFor
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit{
  books: any;
  headersTable:any[]=[
    {label:'Titulo', value:'titulo'},
    {label:'Autor', value:'autor'},
    {label:'Genero', value:'genero'},
    {label:'Fecha de Publicacion', value:'fechaPublicacion'},
    {label:'Número de Paginas', value:'numPaginas'},
    {label:'Stock Disponible', value:'stock_disponible'}
  ]
  visible: boolean = false;
  bookSelected?: any;

  constructor(
    private _bookService: BooksService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  toggleDialog() {  
    this.bookSelected = undefined;
    this.visible = !this.visible;
  }
  setBookSelected(book: any) {
    this.toggleDialog();
    this.bookSelected = book;
  }
  confirmDelete(event: Event, bookId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'py-1 px-2 bg-red-700 text-white',
      rejectButtonStyleClass: 'py-1 px-2',
      accept: () => {
        this.deleteBook(bookId);
      },
    });
  }
  deleteBook(id: number) {
    this._bookService.delete(id).subscribe({
      next: (response) => {
        this.showToast({
          severity: 'success',
          summary: 'Book removed',
          details: 'The book has been removed.',
          life: 4000,
        });
        this.loadBooks();
      },
      error: (error) => console.log('Error deleting book', error),
    });
  }
  loadBooks() {
    this._bookService.getAll().subscribe({
      next: (response: any) => {
        this.books = response;
      },
      error: (error) => {
        console.error('Error getting books:', error);
      },
    });
  }
  


  showToast(data: {
    severity: string;
    summary: string;
    details: string;
    life: number;
  }) {
    this.messageService.add({
      severity: data.severity,
      summary: data.summary,
      detail: data.details,
      life: data.life,
    });
  }

}

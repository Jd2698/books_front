import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BooksService } from '../services/books.service';
import { Ibook } from '../model/book.model';
import { noWhitespaceValidator } from '../../../shared/whitespace.validator';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css',
})
export class BookFormComponent implements OnInit {
  @Input() selectedBook?: Ibook;

  @Output() toggleModalVisibility = new EventEmitter<void>();
  @Output() refreshBooks = new EventEmitter<void>();
  @Output() showToast = new EventEmitter<{
    severity: string;
    summary: string;
    details: string;
    life: number;
  }>();

  disponibleOptions = [
    { label: 'yes', value: true },
    { label: 'no', value: false },
  ];

  formGroup!: FormGroup;
  private _booksService = inject(BooksService);

  constructor(private _formBuild: FormBuilder) {
    this.formGroup = _formBuild.group({
      titulo: ['', [Validators.required, noWhitespaceValidator()]],
      fechaPublicacion: ['', [Validators.required]],
      genero: ['', [Validators.required, noWhitespaceValidator()]],
      numPaginas: [null, [Validators.required, Validators.min(0)]],
      resumen: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator()]],
      autor: ['', [Validators.required, noWhitespaceValidator()]],
      numLibros: [null, [Validators.required, Validators.min(0)]],
      disponible: [true, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.selectedBook) {
      this.formGroup.setValue({
        titulo: this.selectedBook.titulo,
        fechaPublicacion: this.selectedBook.fechaPublicacion
          .toString()
          .split('T')[0],
        genero: this.selectedBook.genero,
        numPaginas: this.selectedBook.numPaginas,
        resumen: this.selectedBook.resumen,
        autor: this.selectedBook.autor,
        numLibros: this.selectedBook.numLibros,
        disponible: this.selectedBook.disponible,
      });
    }
  }

  emitModalToggle() {
    this.toggleModalVisibility.emit();
  }

  hasError(data: { field: string; error: string }) {
    const control = this.formGroup.controls[data.field];

    const error = control.errors?.[data.error];
    const isTouchedOrDirty = control.touched || control.dirty;

    return error && isTouchedOrDirty;
  }

  resetFormGroup(): void {
    this.formGroup.reset();
  }

  submit(): void {
    //para actualizar y crear
    if (this.selectedBook) {
      const fechaPublicacion = new Date(
        this.formGroup.get('fechaPublicacion')?.value
      );
      const updatedData = { ...this.formGroup.value, fechaPublicacion };
      this._booksService.update(this.selectedBook.id, updatedData).subscribe({
        next: (response) => {
          this.resetFormGroup();
          this.refreshBooks.emit();
          this.emitModalToggle();

          this.showToast.emit({
            severity: 'success',
            summary: 'Book updated',
            details: 'The book has been updated.',
            life: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating book', error);
          this.showToast.emit({
            severity: 'error',
            summary: 'Error updating book.',
            details: 'The book could not be updated.',
            life: 3000,
          });
        },
      });
    } else {
      this._booksService.create(this.formGroup.value).subscribe({
        next: (response) => {
          this.resetFormGroup();
          this.refreshBooks.emit();
          this.emitModalToggle();

          this.showToast.emit({
            severity: 'success',
            summary: 'New user added',
            details: 'The user has been added.',
            life: 3000,
          });
        },
        error: (error) => {
          console.error('Error fetching users', error);
          this.showToast.emit({
            severity: 'error',
            summary: 'Error creating user.',
            details: 'The user could not be created.',
            life: 3000,
          });
        },
      });
    }
  }

  formatDate() {
    const control = this.formGroup.get('fechaPublicacion');
    if (control?.value) {
      const formatted = new Date(control.value);
      control.setValue(formatted.toISOString());
    }
  }
}

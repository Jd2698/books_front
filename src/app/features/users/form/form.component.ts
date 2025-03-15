import { NgFor, NgIf } from '@angular/common';
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
import { UsersService } from '../services/users.service';
import { imageTypeValidator } from '../../../shared/imageTypeValidator.validator';
import { noWhitespaceValidator } from '../../../shared/whitespace.validator';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  @Input() selectedUser!: any;

  @Output() toggleModalVisibility = new EventEmitter<void>();
  @Output() refreshUsers = new EventEmitter<void>();
  @Output() showToast = new EventEmitter<{
    severity: string;
    summary: string;
    details: string;
    life: number;
  }>();

  formData = new FormData();
  imageSrc: string | ArrayBuffer | null = null;
  formGroup!: FormGroup;
  private _userService = inject(UsersService);
  private _formBuild = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();

    if (this.selectedUser) {
      this.formGroup.setValue({
        nombre: this.selectedUser.nombre,
        email: this.selectedUser.email,
        telefono: this.selectedUser.telefono,
        imagen: this.selectedUser.imagen,
      });
    }
  }

  initializeForm(): void {
    this.formGroup = this._formBuild.group({
      nombre: ['', [Validators.required, noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [null, Validators.pattern(/^\d{10}$/)],
      imagen: [null, imageTypeValidator]
    });
  }

  emitModalToggle(): void {
    this.toggleModalVisibility.emit();
  }

  hasError(data: { field: string; error: string }): boolean {
    const control = this.formGroup.controls[data.field];

    const error = control.errors?.[data.error];
    const isTouchedOrDirty = control.touched || control.dirty;

    return error && isTouchedOrDirty;
  }

  resetFormGroup(): void {
    this.formGroup.reset();
  }

  changeFile(event: any): void {
    const file = event.target.files[0];
    this.formGroup.controls['imagen'].markAsTouched();

    // agregarlo al formdata y al formgroup
    this.formGroup.controls['imagen'].setValue(file);
    if (file && this.formGroup.controls['imagen'].valid) {
      this.formData.set('file', file, file.name);
      this.formGroup.controls['imagen'].setValue(file);

      const reader = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imageSrc = null;
    }
  }

  submit(): void {
    // agregar los valores al formData y no incluir datos nulos
    const formValues = this.formGroup.value;
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        if (formValues[key]) this.formData.append(key, formValues[key]);
      }
    }

    // agregar la url de la imagen
    this.selectedUser
      ? this.formData.set('imagen', this.selectedUser.imagen)
      : this.formData.delete('imagen');

    //para actualizar y crear
    if (this.selectedUser) {
      this._userService.update(this.selectedUser.id, this.formData).subscribe({
        next: (response) => {
          this.resetFormGroup();
          this.refreshUsers.emit();
          this.emitModalToggle();

          this.showToast.emit({
            severity: 'success',
            summary: 'user updated',
            details: 'The user has been updated.',
            life: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating user', error);
          this.showToast.emit({
            severity: 'error',
            summary: 'Error updating user.',
            details: 'The user could not be updated.',
            life: 3000,
          });
        },
      });
    } else {
      this._userService.create(this.formData).subscribe({
        next: (response) => {
          this.resetFormGroup();
          this.refreshUsers.emit();
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
}

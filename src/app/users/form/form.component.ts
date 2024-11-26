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
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../services/users.service';
import { noWhitespaceValidator } from '../../shared/whitespace.validator';
import { Iuser } from '../model/user.model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, NgIf, FileUploadModule],
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
      });
    }
  }

  initializeForm(): void {
    this.formGroup = this._formBuild.group({
      nombre: ['', [Validators.required, noWhitespaceValidator()]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [null, Validators.pattern(/^\d{10}$/)],
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

  changeFile(event: any) {
    const file = event.target.files[0];
    if (this.formData.has('file')) this.formData.delete('file');
    this.formData.append('file', file, file.name);

    const reader = new FileReader();

    reader.onload = () => {
      this.imageSrc = reader.result;
    };

    reader.readAsDataURL(file);
  }

  submit(): void {
    const formValues = this.formGroup.value;
    let data = { ...formValues };

    //para actualizar y crear
    if (this.selectedUser) {
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          this.formData.append(key, formValues[key]);
        }
      }

      this._userService.update(this.selectedUser.id, data).subscribe({
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
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          console.log(key);

          this.formData.append(key, formValues[key]);
        }
	  }
		
		return

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

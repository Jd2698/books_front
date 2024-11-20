import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  @Output() toggleDialog = new EventEmitter<void>();
  @Output() loadUsers = new EventEmitter<void>();

  formGroup!: FormGroup;

  runDialogEmitter() {
    this.toggleDialog.emit();
  }

  private _userService = inject(UsersService);

  constructor(private _formBuild: FormBuilder) {
    this.formGroup = _formBuild.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [null],
    });
  }

  hasError(data: { field: string; error: string }) {
    return (
      this.formGroup.controls[data.field].errors?.[data.error] &&
      this.formGroup.controls[data.field].touched
    );
  }

  resetFormGroup(): void {
    this.formGroup.reset();
  }

  submit(): void {
    const telefono = this.formGroup.controls['telefono'].value || null;

    const data = { ...this.formGroup.value, telefono };

    this._userService.create(data).subscribe({
      next: (response) => {
        this.resetFormGroup();
        this.loadUsers.emit();
      },
      error: (error) => {
        console.error('Error fetching users', error);
      },
    });
  }
}

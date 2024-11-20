import { NgClass, NgIf } from '@angular/common';
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
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  @Input() userSelected!: any;

  @Output() toggleDialog = new EventEmitter<void>();
  @Output() loadUsers = new EventEmitter<void>();
  @Output() showToast = new EventEmitter<{
    severity: string;
    summary: string;
    details: string;
    life: number;
  }>();

  ngOnInit(): void {
    if (this.userSelected) {
      this.formGroup.setValue({
        name: this.userSelected.name,
        email: this.userSelected.email,
        telefono: this.userSelected.telefono,
      });
    }
  }

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

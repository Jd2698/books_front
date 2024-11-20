import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormComponent } from './form/form.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    FormComponent,
    ConfirmPopupModule,
    ToastModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  //
  constructor(
    private _userService: UsersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  confirmDelete(event: Event, userId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'py-1 px-2 bg-red-700 text-white',
      rejectButtonStyleClass: 'py-1 px-2',
      accept: () => {
        this.deleteUser(userId);
      }
    });
  }

  users: any;
  visible: boolean = false;

  toggleDialog() {
    this.visible = !this.visible;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this._userService.getAll().subscribe({
      next: (response) => (this.users = response),
      error: (error) => console.log('Error getting users', error),
    });
  }

  deleteUser(id: number) {
    this._userService.delete(id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
          life: 3000,
        });
        this.loadUsers();
      },
      error: (error) => console.log('Error deleting user', error),
    });
  }
}

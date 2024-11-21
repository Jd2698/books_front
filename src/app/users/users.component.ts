import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormComponent } from './form/form.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgIf } from '@angular/common';

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
    NgIf,
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

  users: any;
  visible: boolean = false;
  userSelected?: any;

  ngOnInit(): void {
    this.loadUsers();
  }

  setUserSelected(user: any) {
    this.toggleDialog();
    this.userSelected = user;
  }

  loadUsers(): void {
    this._userService.getAll().subscribe({
      next: (response) => (this.users = response),
      error: (error) => console.log('Error getting users', error),
    });
  }

  toggleDialog() {  
    this.userSelected = undefined;
    this.visible = !this.visible;
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

  confirmDelete(event: Event, userId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'py-1 px-2 bg-red-700 text-white',
      rejectButtonStyleClass: 'py-1 px-2',
      accept: () => {
        this.deleteUser(userId);
      },
    });
  }

  deleteUser(id: number) {
    this._userService.delete(id).subscribe({
      next: (response) => {
        this.showToast({
          severity: 'success',
          summary: 'User removed',
          details: 'The user has been removed.',
          life: 4000,
        });
        this.loadUsers();
      },
      error: (error) => console.log('Error deleting user', error),
    });
  }
}

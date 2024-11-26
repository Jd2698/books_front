import { Component, OnInit } from '@angular/core'
import { UsersService } from './services/users.service'
import { TableModule } from 'primeng/table'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { FormComponent } from './form/form.component'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { NgIf } from '@angular/common'
import { Iuser } from './model/user.model'
import { FormsModule } from '@angular/forms'
import { InputIconModule } from 'primeng/inputicon'
import { map } from 'rxjs'

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
		FormsModule,
		InputIconModule
	],
	templateUrl: './users.component.html',
	styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
	constructor(
		private _userService: UsersService,
		private _confirmationService: ConfirmationService,
		private _messageService: MessageService
	) {}

	searchKeyword = ''
	users!: Iuser[]
	isModalVisible: boolean = false
	selectedUser?: any

	ngOnInit(): void {
		this.loadUsers()
	}

	URLHOST: string = 'http://localhost:3000/images/'

	loadUsers(): void {
		this._userService
			.getAll()
			.pipe(
				// agregarle la url completa de la imagen
				map((response: Iuser[]) => {
					return response.map((user: Iuser) => {
						return {
							...user,
							urlImagen: user.imagen
								? `${this.URLHOST}${user.imagen}`
								: 'not found'
						}
					})
				})
			)
			.subscribe({
				next: (response: Iuser[]) => (this.users = response),
				error: error => console.log('Error fetching  users', error)
			})
	}

	toggleModalVisibility(): void {
		this.selectedUser = undefined
		this.isModalVisible = !this.isModalVisible
	}

	setSelectedUser(user: Iuser): void {
		this.toggleModalVisibility()
		this.selectedUser = user
	}

	confirmDelete(event: Event, userId: number): void {
		this._confirmationService.confirm({
			target: event.target as EventTarget,
			message: 'Do you want to delete this record?',
			icon: 'pi pi-info-circle',
			acceptButtonStyleClass: 'py-1 px-2 bg-red-700 text-white',
			rejectButtonStyleClass: 'py-1 px-2',
			accept: () => {
				this.deleteUser(userId)
			}
		})
	}

	deleteUser(id: number): void {
		this._userService.delete(id).subscribe({
			next: response => {
				this.showToast({
					severity: 'success',
					summary: 'User removed',
					details: 'The user has been removed.',
					life: 4000
				})
				this.loadUsers()
			},
			error: error => console.log('Error deleting user', error)
		})
	}

	showToast(data: {
		severity: string
		summary: string
		details: string
		life: number
	}) {
		this._messageService.add({
			severity: data.severity,
			summary: data.summary,
			detail: data.details,
			life: data.life
		})
	}
}

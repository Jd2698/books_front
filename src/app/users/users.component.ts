import { Component, OnInit } from '@angular/core'
import { UsersService } from './users.service'
import { TableModule } from 'primeng/table'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [TableModule, DialogModule, ButtonModule],
	templateUrl: './users.component.html',
	styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
	constructor(private _userService: UsersService) {}

	users: any
	visible: boolean = false

	showDialog() {
		this.visible = !this.visible
	}

	ngOnInit(): void {
		this._userService.getAll().subscribe({
			next: data => (this.users = data)
		})
	}
}

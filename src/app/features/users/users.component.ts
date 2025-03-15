import { Component, OnInit } from '@angular/core'
import { UsersService } from './services/users.service'
import { FormComponent } from './form/form.component'
import { NgIf } from '@angular/common'
import { Iuser } from './model/user.model'
import { FormsModule } from '@angular/forms'
import { map } from 'rxjs'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormComponent, NgIf, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  constructor(private _userService: UsersService) { }

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
        next: (response: any) => (this.users = response)
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

  confirmDelete(event: Event, userId: number): void { }

  deleteUser(id: number): void { }
}

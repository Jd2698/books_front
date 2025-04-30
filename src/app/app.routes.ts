import { Routes } from '@angular/router'
import { UsersComponent } from './features/users/users.component'
import { BooksComponent } from './features/books/books.component'
import { LoansComponent } from './features/loans/loans.component'
import { LoginComponent } from './features/auth/login/login.component'
import { RegisterComponent } from './features/auth/register/register.component'
import { authGuard, authRedirectGuard } from './core/guards'
import { roleGuard } from './core/guards/auth/role.guard'

export const routes: Routes = [
	{
		path: 'users',
		component: UsersComponent,
		canActivate: [roleGuard],
		data: { requiredRole: 'admin' }
	},
	{
		path: 'auth/login',
		component: LoginComponent,
		canActivate: [authRedirectGuard]
	},
	{
		path: 'auth/register',
		component: RegisterComponent,
		canActivate: [authRedirectGuard]
	},
	{ path: 'books', component: BooksComponent },
	{ path: 'loans', component: LoansComponent, canActivate: [authGuard] },
	{ path: '**', redirectTo: 'books', pathMatch: 'full' }
]

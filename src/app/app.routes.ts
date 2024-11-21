import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoansComponent } from './loans/loans.component';

export const routes: Routes = [
	{path: 'users', component: UsersComponent},
	{path: 'loans', component: LoansComponent},
];

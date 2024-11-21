import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { BooksComponent } from './books/books.component';

export const routes: Routes = [
	{path: 'users', component: UsersComponent},
	{path: 'books', component: BooksComponent}
];

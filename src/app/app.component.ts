import { Component } from '@angular/core'
import {
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet
} from '@angular/router'
import { MenubarModule } from 'primeng/menubar'

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, MenubarModule, RouterLinkActive, RouterLink],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	constructor(private _route: Router) {}
	items = [
		{
			label: 'users',
			icon: 'pi pi-users',
			routerLink: '/users'
		},
		{
			label: 'books',
			icon: 'pi pi-book',
			routerLink: '/books'
		},
		{
			label: 'loans',
			icon: 'pi pi-clipboard',
			routerLink: '/loans'
		}
	]
}

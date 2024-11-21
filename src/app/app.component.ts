import { Component } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { MenubarModule } from 'primeng/menubar'

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, MenubarModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	constructor(private _route: Router) {}
	items = [
		{
			label: 'users',	
			icon: 'pi pi-users text-3xl',
			command: () => this._route.navigateByUrl('users')
		},
		{
			label: 'loans',	
			icon: 'pi pi-clipboard text-3xl',
			command: () => this._route.navigateByUrl('loans')
		},
	]
}

import { Component, computed, inject, Signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { AuthService } from '../../core/services/auth.service'
import { NgIf } from '@angular/common'
import { Roles } from '../../core/enums/roles.enums'

@Component({
	selector: 'app-nav-bar',
	standalone: true,
	imports: [RouterLink, RouterLinkActive, NgIf],
	templateUrl: './nav-bar.component.html',
	styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
	_authService = inject(AuthService)

	isAdmin: Signal<boolean> = computed(() => {
		return this._authService.user()?.rol === Roles.ADMIN
	})

	logout(): void {
		this._authService.logout()
	}
}

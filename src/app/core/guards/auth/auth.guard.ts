import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { AuthService } from '../../services'

export const authGuard: CanActivateFn = (route, state) => {
	const isAuthenticated$ = inject(AuthService).isAuthenticatedSignal()

	return isAuthenticated$
}

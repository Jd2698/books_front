import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router'
import { AuthService } from '../../services'

export const authGuard: CanActivateFn = (
	route: ActivatedRouteSnapshot,
	state
) => {
	const isAuthenticated$ = inject(AuthService).isAuthenticated()

	return isAuthenticated$
}

import { inject } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../../services'

export const roleGuard: CanActivateFn = (
	route: ActivatedRouteSnapshot,
	state
) => {
	const router = inject(Router)
	const userInfo$ = inject(AuthService).user()

	const requiredRole = route.data['requiredRole']

	if (requiredRole && userInfo$?.rol !== requiredRole) {
		router.navigate(['/books'])
		return false
	}

	return true
}

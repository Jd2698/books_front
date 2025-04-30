import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../../services'

export const authRedirectGuard: CanActivateFn = (route, state) => {
	const _authService = inject(AuthService)
	const _router = inject(Router)

	if (_authService.isAuthenticated()) {
		_router.navigate(['books'])
		return false
	}

	return true
}

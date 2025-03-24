import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../../services'

export const authGuard: CanActivateFn = (route, state) => {
	const _authService = inject(AuthService)
	const _router = inject(Router)

	if (_authService.isAuthenticatedSignal()) return true

	_router.navigate(['auth/login'])
	return false
}

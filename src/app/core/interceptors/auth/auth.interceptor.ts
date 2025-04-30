import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, switchMap, throwError } from 'rxjs'
import { AuthService } from '../../services'
import { Router } from '@angular/router'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const _authService = inject(AuthService)
	const _router = inject(Router)

	const skipURLs = ['/login', '/register', '/logout', '/refresh']

	/**
	 * Not apply catchError to previous routes
	 */
	if (skipURLs.some(url => req.url.includes(url))) {
		return next(req)
	}

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				return _authService.refreshToken().pipe(
					switchMap(() => {
						return next(req)
					}),
					catchError(refreshError => {
						return throwError(() => refreshError)
					})
				)
			}

			return throwError(() => error)
		})
	)
}

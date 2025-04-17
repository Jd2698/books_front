import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, switchMap, throwError } from 'rxjs'
import { AuthService } from '../../services'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService)

	const isAuthUrl =
		req.url.includes('/login') ||
		req.url.includes('/register') ||
		req.url.includes('/refresh') ||
		req.url.includes('/logout')

	if (isAuthUrl) {
		return next(req)
	}

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				return authService.refreshToken().pipe(
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

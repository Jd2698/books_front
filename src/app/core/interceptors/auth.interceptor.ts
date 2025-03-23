import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'
import { AuthService } from '../auth.service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const router = inject(Router)
	const auth = inject(AuthService)

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				console.log('unauthorized', error)
				auth.logout()
			}

			return throwError(() => error)
		})
	)
}

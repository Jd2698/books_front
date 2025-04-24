import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, Signal, signal } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, Observable, of, tap, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private url = `${environment.apiUrl}/auth`

	private authenticatedSignal = signal(false)

	isAuthenticatedSignal: Signal<boolean> = this.authenticatedSignal

	constructor(private http: HttpClient, private router: Router) {}

	checkAuth(): Observable<{ authenticated: boolean }> {
		return this.http.get<{ authenticated: boolean }>(`${this.url}/check`).pipe(
			tap(() => {
				this.authenticatedSignal.set(true)
			}),
			catchError(() => {
				return of({ authenticated: false })
			})
		)
	}

	login(email: string, password: string) {
		return this.http
			.post<void>(`${this.url}/login`, { email, password })
			.pipe(
				tap(() => {
					this.authenticatedSignal.set(true)
					this.router.navigate(['/users'])
				}),
				catchError((error: HttpErrorResponse) => {
					return throwError(() => error)
				})
			)
			.subscribe()
	}

	refreshToken(): Observable<void> {
		return this.http
			.post<void>(
				`${this.url}/refresh`,
				{},
				{
					withCredentials: true
				}
			)
			.pipe(
				tap(() => {
					this.authenticatedSignal.set(true)
				}),
				catchError((error: HttpErrorResponse) => {
					this.authenticatedSignal.set(false)
					return throwError(() => error)
				})
			)
	}

	register(email: string, password: string) {
		return this.http.post(`${this.url}/register`, { email, password })
	}

	logout() {
		this.http
			.post<{ access_token: string }>(`${this.url}/logout`, {})
			.pipe(
				tap(() => {
					this.authenticatedSignal.set(false)
					this.router.navigate(['/auth/login'])
				}),
				catchError(err => {
					console.error('Logout error:', err)
					return of(null)
				})
			)
			.subscribe()
	}
}

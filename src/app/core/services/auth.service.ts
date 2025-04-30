import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, Signal, signal } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, map, Observable, of, tap, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface IUserInfo {
	sub: string
	email: string
	rol: string
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private url = `${environment.apiUrl}/auth`

	private isAuthenticatedSignal = signal(false)
	private userSignal = signal<{
		sub: string
		email: string
		rol: string
	} | null>(null)

	constructor(
		private readonly _http: HttpClient,
		private readonly _router: Router
	) {}

	get user(): Signal<IUserInfo | null> {
		return this.userSignal
	}

	get isAuthenticated(): Signal<boolean> {
		return this.isAuthenticatedSignal
	}

	checkAuth(): Observable<{ authenticated: boolean }> {
		return this._http.get<IUserInfo>(`${this.url}/check`).pipe(
			tap(({ sub, email, rol }) => {
				this.isAuthenticatedSignal.set(true)
				this.userSignal.set({ sub, email, rol })
			}),
			map(() => ({ authenticated: true })),
			catchError(() => {
				return of({ authenticated: false })
			})
		)
	}

	login(
		email: string | null,
		password: string | null,
		withGoogle: boolean,
		googleToken: string | null
	) {
		const url = withGoogle ? `${this.url}/google` : `${this.url}/login`
		const body = withGoogle ? { tokenId: googleToken } : { email, password }

		this._http
			.post<IUserInfo>(url, body)
			.pipe(
				tap(({ sub, email, rol }) => {
					this.isAuthenticatedSignal.set(true)
					this.userSignal.set({ sub, email, rol })
					this._router.navigate(['/users'])
				}),
				catchError((error: HttpErrorResponse) => {
					return throwError(() => error)
				})
			)
			.subscribe()
	}

	refreshToken(): Observable<void> {
		return this._http
			.post<void>(
				`${this.url}/refresh`,
				{},
				{
					withCredentials: true
				}
			)
			.pipe(
				tap(() => {
					this.isAuthenticatedSignal.set(true)
				}),
				catchError((error: HttpErrorResponse) => {
					this.isAuthenticatedSignal.set(false)
					return throwError(() => error)
				})
			)
	}

	register(email: string, password: string) {
		return this._http.post(`${this.url}/register`, { email, password })
	}

	logout() {
		this._http
			.post(`${this.url}/logout`, {})
			.pipe(
				tap(() => {
					this.isAuthenticatedSignal.set(false)
					this.userSignal.set(null)
					this._router.navigate(['/auth/login'])
				}),
				catchError(err => {
					console.error('Logout error:', err)
					return of(null)
				})
			)
			.subscribe()
	}
}

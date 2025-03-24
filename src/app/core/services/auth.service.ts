import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, Signal, signal, WritableSignal } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, map, throwError } from 'rxjs'

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private url = 'http://localhost:3000/auth'

	private authenticatedSignal = signal(this.isAuthenticated())
	isAuthenticatedSignal: Signal<boolean> = this.authenticatedSignal

	constructor(private http: HttpClient, private router: Router) {}

	login(email: string, password: string) {
		return this.http
			.post<{ access_token: string }>(`${this.url}/login`, { email, password })
			.pipe(
				map(res => res),
				catchError((error: HttpErrorResponse) => {
					return throwError(() => error)
				})
			)
			.subscribe((response: { access_token: string }) => {
				localStorage.setItem('token', response.access_token)

				this.authenticatedSignal.set(true)
				this.router.navigate(['/users'])
			})
	}

	register(email: string, password: string) {
		return this.http.post(`${this.url}/register`, { email, password })
	}

	logout() {
		localStorage.removeItem('token')
		this.authenticatedSignal.set(false)
		this.router.navigate(['/auth/login'])
	}

	isAuthenticated(): boolean {
		return !!localStorage.getItem('token')
	}

	getToken(): string | null {
		return localStorage.getItem('token')
	}
}

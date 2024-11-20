import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root'
})
export class UsersService {
	constructor(private _http: HttpClient) {}

	getAll() {
		return this._http.get('http://localhost:3000/users')
	}
}

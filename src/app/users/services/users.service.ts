import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Iuser } from '../model/user.model'
@Injectable({
	providedIn: 'root'
})
export class UsersService {
	constructor(private _http: HttpClient) {}
	urlPath: string = 'http://localhost:3000/users'

	uploadImage(data:any): Observable<any> {
		return this._http.post(`${this.urlPath}/upload`, data)
	}

	getAll(): Observable<Iuser[]> {
		return this._http.get<Iuser[]>(this.urlPath)
	}

	create(data: Iuser): Observable<Iuser> {
		return this._http.post<Iuser>(this.urlPath, data)
	}

	delete(userId: number): Observable<Iuser> {
		return this._http.delete<Iuser>(`${this.urlPath}/${userId}`)
	}

	update(userId: number, data: Iuser): Observable<Iuser> {
		return this._http.put<Iuser>(`${this.urlPath}/${userId}`, data)
	}
}

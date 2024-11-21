import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
	providedIn: 'root'
})
export class LoansService {
	constructor(private _http: HttpClient) {}
	urlPath: string = 'http://localhost:3000/loans'

	getAll(): Observable<any> {
		return this._http.get(this.urlPath)
	}

	create(data: any): Observable<any> {
		return this._http.post(this.urlPath, data)
	}

	// delete(userId: number): Observable<any> {
	// 	return this._http.delete(`${this.urlPath}/${userId}`)
	// }

	// update(userId: number, data: any): Observable<any> {
	// 	return this._http.put(`${this.urlPath}/${userId}`, data)
	// }
}

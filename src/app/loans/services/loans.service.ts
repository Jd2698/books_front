import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Iloan } from '../model/loan.model'

@Injectable({
	providedIn: 'root'
})
export class LoansService {
	constructor(private _http: HttpClient) {}
	urlPath: string = 'http://localhost:3000/loans'

	getAll(): Observable<any> {
		return this._http.get(this.urlPath)
	}

	create(data: Iloan): Observable<any> {
		return this._http.post(this.urlPath, data)
	}

	delete(loanId: number): Observable<any> {
		return this._http.delete(`${this.urlPath}/${loanId}`)
	}

	update(loanId: number, data: Iloan): Observable<any> {
		return this._http.put(`${this.urlPath}/${loanId}`, data)
	}
}

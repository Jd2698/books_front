import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, Observable, throwError } from 'rxjs'
import { IBook } from '../model/book.model'

@Injectable({
	providedIn: 'root'
})
export class BooksService {
	constructor(private httpClient: HttpClient) {}

	urlPath: string = 'http://localhost:3000/books'

	getAll(): Observable<any> {
		return this.httpClient.get<any>(this.urlPath).pipe(
			map((data: any) => {
				const modifiedData = data.map((value: any) => {
					return { ...value, deshabilitar: !value.disponible }
				})
				return modifiedData
			})
		)
	}

	create(body: any): Observable<any> {
		return this.httpClient.post(this.urlPath, body)
	}

	update(id: string, body: any): Observable<any> {
		return this.httpClient.put(`${this.urlPath}/${id}`, body)
	}

	delete(id: number): Observable<any> {
		return this.httpClient.delete<any>(`${this.urlPath}/${id}`)
	}
}

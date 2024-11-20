import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _http: HttpClient) {}

  urlPath: string = 'http://localhost:3000/users';

  getAll(): Observable<any> {
    return this._http.get(this.urlPath);
  }

  create(data: {
    name: string;
    email: string;
    telefono?: number;
  }): Observable<any> {
    return this._http.post(this.urlPath, data);
  }

  delete(userId: number): Observable<any> {
    return this._http.delete(`${this.urlPath}/${userId}`);
  }
}

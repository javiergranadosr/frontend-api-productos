import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Category, Department } from '../interfaces/common';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _baseUrl: string = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  public getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this._baseUrl}/departments/all`).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return of([]);
      })
    );
  }

  public getAllCategories(id: number): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this._baseUrl}/categories/all/${id}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return of([]);
        })
      );
  }

  public showPhoto(filename: string | null , module: string) {
    return `${this._baseUrl}/${module}/show-image/${filename}`;
  }

  public uploadPhoto(id: number, photo: File, module: string): Observable<any> {
    let formData = new FormData();
    formData.append('id', id.toString());
    formData.append('file', photo);
    return this.http.post<any>(`${this._baseUrl}/${module}/upload`, formData);
  }
}

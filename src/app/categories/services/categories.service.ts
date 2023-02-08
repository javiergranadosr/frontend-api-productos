import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { SuccessResponse } from 'src/app/shared/common/interfaces/success-response';
import { environment } from 'src/environments/environment';
import { Category } from '../interfaces/create-category';
import { ListCategories } from '../interfaces/list-category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _baseUrl: string = `${environment.baseUrl}/categories`;

  constructor(private _http: HttpClient) {}

  public getAllCategories(
    size: number,
    page: number,
    departmentId: number = 0
  ): Observable<ListCategories> {
    let params = new HttpParams()
      .append('size', size)
      .append('page', page)
      .append('departmentId', departmentId);
    return this._http.get<ListCategories>(this._baseUrl, { params }).pipe(
      delay(2000),
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(() => new Error('Error in getting categories.'));
      })
    );
  }

  public create(category: Category): Observable<SuccessResponse> {
    return this._http.post<SuccessResponse>(`${this._baseUrl}`, category);
  }

  public getKeyForm(key: string): string {
    let keyForm: string = '';
    switch (key) {
      case 'departmentId':
        keyForm = 'El departamento';
        break;
      case 'name':
        keyForm = 'El nombre de la categoría';
        break;
    }
    return keyForm;
  }

}

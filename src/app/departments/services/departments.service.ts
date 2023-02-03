import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { SuccessResponse } from 'src/app/shared/common/interfaces/success-response';
import { environment } from 'src/environments/environment';
import { ListDepartments } from '../interfaces/list-departments';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private _baseUrl: string = `${environment.baseUrl}/departments`;

  constructor(private _http: HttpClient) {}

  public getAllDepartments(
    size: number,
    page: number
  ): Observable<ListDepartments> {
    let params = new HttpParams().append('size', size).append('page', page);
    return this._http.get<ListDepartments>(this._baseUrl, { params }).pipe(
      delay(2000),
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(() => new Error('Error in getting departments.'));
      })
    );
  }

  public deleteDepartment(departmentId: number): Observable<SuccessResponse> {
    return this._http.delete<SuccessResponse>(`${this._baseUrl}/${departmentId}`);
  }

}

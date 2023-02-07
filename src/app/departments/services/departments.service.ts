import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { SuccessResponse } from 'src/app/shared/common/interfaces/success-response';
import { environment } from 'src/environments/environment';
import { Department } from '../interfaces/create-department';
import { Content, ListDepartments } from '../interfaces/list-departments';

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

  public getDepartmentById(departmentId: number): Observable<Content> {
    return this._http
      .get<Content>(`${this._baseUrl}/${departmentId}`)
      .pipe(delay(2000));
  }

  public create(department: Department): Observable<SuccessResponse> {
    return this._http.post<SuccessResponse>(this._baseUrl, department);
  }

  public deleteDepartment(departmentId: number): Observable<SuccessResponse> {
    return this._http.delete<SuccessResponse>(
      `${this._baseUrl}/${departmentId}`
    );
  }

  public getKeyForm(key: string): string {
    let keyForm: string = '';
    switch (key) {
      case 'keyDepartment':
        keyForm = 'La clave del departamento';
        break;
      case 'name':
        keyForm = 'El nombre del departamento';
        break;
    }
    return keyForm;
  }
}

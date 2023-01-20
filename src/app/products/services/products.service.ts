import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ListProducts } from '../interfaces/list-products';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _baseUrl: string = `${environment.baseUrl}/products`;

  constructor(private http: HttpClient) {}

  public getAllProducts(): Observable<ListProducts> {
    return this.http.get<ListProducts>(this._baseUrl).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(() => new Error('Error in getting products.'));
      })
    );
  }
}

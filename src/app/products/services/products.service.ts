import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { ListProducts, Content } from '../interfaces/list-products';
import { environment } from '../../../environments/environment';
import { Product } from '../interfaces/create-product';
import { SuccessResponse } from '../../shared/common/interfaces/success-response';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _baseUrl: string = `${environment.baseUrl}/products`;

  constructor(private http: HttpClient) {}

  public getAllProducts(size: number, page: number, categoryId: number = 0): Observable<ListProducts> {
    let params = new HttpParams().append('size', size).append("page", page).append("categoryId", categoryId);
    return this.http.get<ListProducts>(this._baseUrl, { params }).pipe(
      delay(2000),
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(() => new Error('Error in getting products.'));
      })
    );
  }

  public create(product: Product): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this._baseUrl}`, product);
  }

  public getProductById(productId: number): Observable<Content> {
    return this.http
      .get<Content>(`${this._baseUrl}/${productId}`)
      .pipe(delay(2000));
  }

  public update(
    productId: number,
    product: Product
  ): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(
      `${this._baseUrl}/${productId}`,
      product
    );
  }

  public deleteProduct(productId: number): Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`${this._baseUrl}/${productId}`);
  }

  public getKeyForm(key: string): string {
    let keyForm: string = '';
    switch (key) {
      case 'name':
        keyForm = 'Nombre del producto';
        break;
      case 'brand':
        keyForm = 'La marca del producto';
        break;
      case 'model':
        keyForm = 'El modelo del producto';
        break;
      case 'price':
        keyForm = 'El precio del producto';
        break;
      case 'discount':
        keyForm = ' El descuento del producto';
        break;
      case 'department':
        keyForm = ' El departamento';
        break;
      case 'categoryId':
        keyForm = 'La categor??a del producto';
        break;
    }
    return keyForm;
  }
}

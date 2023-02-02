import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Category } from 'src/app/shared/common/interfaces/common';
import { CommonService } from 'src/app/shared/common/services/common.service';
import { PaginationService } from 'src/app/shared/common/services/pagination.service';
import Swal from 'sweetalert2';
import { ListProducts } from '../interfaces/list-products';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public products!: ListProducts;
  public productsSubscription!: Subscription;
  public deleteProductSubscription!: Subscription;
  public loading: boolean = true;
  public loadingData: boolean = false;
  public paginationSubscription!: Subscription;
  public sizeData: number = 5;
  public categories$!: Observable<Category[]>;
  public categoryId: number = 0;
  public filterCategory: FormControl = new FormControl('0');
  public filterSize: FormControl = new FormControl(this.sizeData);
  public sizePages: string[] = [];

  constructor(
    private _productsService: ProductsService,
    private _paginationService: PaginationService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.categories$ = this._commonService.getAllCategories(Number(0));
    this.sizePages = this._paginationService.sizePages;
    this.paginationSubscription = this._paginationService
      .getPage$()
      .subscribe((page) => {
        this.loadingData = true;
        console.log("Page: ", page);
        this.loadProducts(Number(this.filterSize.value), page);
      });
  }

  public deleteProduct(productId: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el producto?',
      text: 'Una vez eliminado no podrá ser recuperado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.deleteProductSubscription = this._productsService
          .deleteProduct(productId)
          .subscribe({
            next: () => {
              Swal.fire(
                'Notificación del sistema',
                'Producto eliminado con éxito.',
                'success'
              );
              this.filterSize.setValue(this.sizeData);
              this.loadProducts(Number(this.filterSize.value), 0);
            },
            error: () => {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al eliminar producto',
                'error'
              );
              this.filterSize.setValue(this.sizeData);
              this.loadProducts(Number(this.filterSize.value), 0);
            },
          });
      }
    });
  }

  public onChange(event: any): void {
    this.categoryId = Number(event.target.value);
    this.filterSize.setValue(this.sizeData);
    this.filterCategory.setValue(this.categoryId);
    this.setValuesFilter(this.categoryId);
  }

  public cleanFilter(): void {
    this.filterCategory.setValue('0');
    this.filterSize.setValue(this.sizeData);
    this.setValuesFilter(0);
  }

  public onChangeFilter(event: Event): void {
    let filterSize: number = Number((event.target as HTMLInputElement).value);
    this.filterSize.setValue(filterSize);
    this.setValuesFilter(this.categoryId);
  }

  private setValuesFilter(categoryId: number) {
    this.categoryId = categoryId;
    this._paginationService.setPage(0);
    this._paginationService.setPagination({
      page: 1,
      prev: 0,
      next: 0,
    });
  }

  private loadProducts(size: number = 10, page: number): void {
    this._productsService
      .getAllProducts(size, page, this.categoryId)
      .subscribe((products) => {
        this.loading = false;
        this.loadingData = false;
        this.products = products;
      });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    if (this.deleteProductSubscription) {
      this.deleteProductSubscription.unsubscribe();
    }

    if (this.paginationSubscription) {
      this._paginationService.setPage(0);
      this.paginationSubscription.unsubscribe();
    }
  }
}

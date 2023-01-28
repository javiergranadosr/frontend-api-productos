import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  public sizeData: number = 10;

  constructor(
    private productsService: ProductsService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.paginationSubscription = this.paginationService.page$.subscribe(
      (page) => {
        this.loadingData = true;
        this.loadProducts(this.sizeData,page);
      }
    );
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
        this.deleteProductSubscription = this.productsService
          .deleteProduct(productId)
          .subscribe({
            next: () => {
              Swal.fire(
                'Notificación del sistema',
                'Producto eliminado con éxito.',
                'success'
              );
              this.loadProducts(this.sizeData,0);
            },
            error: () => {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al eliminar producto',
                'error'
              );
              this.loadProducts(this.sizeData,0);
            },
          });
      }
    });
  }

  private loadProducts(size: number = 10, page: number): void {
    this.productsService.getAllProducts(size, page).subscribe((products) => {
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
      this.paginationService.setPage(0);
      this.paginationSubscription.unsubscribe();
    }
  }
}

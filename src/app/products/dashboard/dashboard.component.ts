import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProductSubscription = this.productsService
          .deleteProduct(productId)
          .subscribe({
            next: () => {
              Swal.fire(
                'Notificación del sistema',
                'Producto eliminado con éxito.',
                'success'
              );
              this.loadProducts();
            },
            error: () => {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al eliminar producto',
                'error'
              );
            },
          });
      }
    });
  }

  private loadProducts(): void {
    this.productsService.getAllProducts().subscribe((products) => {
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
  }
}

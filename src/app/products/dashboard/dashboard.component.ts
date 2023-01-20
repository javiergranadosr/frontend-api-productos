import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
}

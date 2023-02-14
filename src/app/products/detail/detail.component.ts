import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Codes,  } from 'src/app/shared/common/enum/codes';
import { ProductsService } from '../services/products.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Content } from '../interfaces/list-products';
import { CommonService } from 'src/app/shared/common/services/common.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
  public productId: number = 0;
  public detailProduct!: Content;
  public noDiscount: number =  0.0;
  private _detailSubscription!: Subscription;


  constructor(
    private _activedRouter: ActivatedRoute,
    private _productService: ProductsService,
    private _router: Router,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    if (
      this._activedRouter.snapshot.params['id'] &&
      this._activedRouter.snapshot.params['id'].length > 0
    ) {
      this.productId = Number(this._activedRouter.snapshot.params['id']);
      this._detailSubscription = this._productService
        .getProductById(this.productId)
        .subscribe({
          next: (product) => {
            this.detailProduct = product;
          },
          error: (error) => {
            if (
              error.status === Codes.CODE_404 ||
              error.status === Codes.CODE_400
            ) {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al obtener información  del producto',
                'error'
              );
              this._router.navigate(['/products']);
            }
          },
        });
    }
  }

  public get photoProduct(): string {
    return this._commonService.showPhoto(this.detailProduct.image, 'products');
  }


  public calculatedDiscount(price: number, discount: number): number {
    let totalDiscount:number = price * discount;
    return price - totalDiscount;
  }


  ngOnDestroy(): void {
    this.productId = 0;
    if (this._detailSubscription) {
      this._detailSubscription.unsubscribe();
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Codes } from 'src/app/shared/common/enum/codes';
import Swal from 'sweetalert2';
import { Content } from '../interfaces/list-category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  public categoryId: number = 0;
  public detailCategory!: Content;
  private _detailSubscription!: Subscription;

  constructor(
    private _activedRouter: ActivatedRoute,
    private _categoriesService: CategoriesService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (
      this._activedRouter.snapshot.params['id'] &&
      this._activedRouter.snapshot.params['id'].length > 0
    ) {
      this.categoryId = Number(this._activedRouter.snapshot.params['id']);
      this._detailSubscription = this._categoriesService
        .getCategoryById(this.categoryId)
        .subscribe({
          next: (category) => {
            this.detailCategory = category;
          },
          error: (error) => {
            if (
              error.status === Codes.CODE_404 ||
              error.status === Codes.CODE_400
            ) {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al obtener información  de la categoría',
                'error'
              );
              this._router.navigate(['/categories']);
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.categoryId = 0;
    if (this._detailSubscription) {
      this._detailSubscription.unsubscribe();
    }
  }
}

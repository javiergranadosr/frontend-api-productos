import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Department } from 'src/app/shared/common/interfaces/common';
import { CommonService } from 'src/app/shared/common/services/common.service';
import { PaginationService } from 'src/app/shared/common/services/pagination.service';
import Swal from 'sweetalert2';
import { ListCategories } from '../interfaces/list-category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public categories!: ListCategories;
  public categorySubscription!: Subscription;
  public deleteCategorySubscription!: Subscription;
  public loading: boolean = true;
  public loadingData: boolean = false;
  public paginationSubscription!: Subscription;
  public sizeData: number = 5;
  public departments$!: Observable<Department[]>;
  public filterDepartment: FormControl = new FormControl('0');
  public filterSize: FormControl = new FormControl(this.sizeData);
  public sizePages: string[] = [];
  public departmentId: number = 0;

  constructor(
    private _categoriesService: CategoriesService,
    private _paginationService: PaginationService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.departments$ = this._commonService.getAllDepartments();
    this.sizePages = this._paginationService.sizePages;
    this.paginationSubscription = this._paginationService
      .getPage$()
      .subscribe((page) => {
        this.loadingData = true;
        console.log('Page: ', page);
        this.loadCategories(Number(this.filterSize.value), page);
      });
  }

  public getPhotoDepartment(filename: string): string {
    return this._commonService.showPhoto(filename, 'categories');
  }

  public deleteCategory(categoryId: number): void {
    Swal.fire({
      title: '??Est?? seguro de eliminar la categor??a?',
      text: 'Una vez eliminada no podr?? ser recuperada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.deleteCategorySubscription = this._categoriesService
          .deleteCategory(categoryId)
          .subscribe({
            next: () => {
              Swal.fire(
                'Notificaci??n del sistema',
                'Categor??a eliminada con ??xito.',
                'success'
              );
              this.filterSize.setValue(this.sizeData);
              this.loadCategories(Number(this.filterSize.value), 0);
            },
            error: () => {
              Swal.fire(
                'Notificaci??n del sistema ',
                'Hubo un error al eliminar la categor??a',
                'error'
              );
              this.filterSize.setValue(this.sizeData);
              this.loadCategories(Number(this.filterSize.value), 0);
            },
          });
      }
    });
  }

  public onChange(event: Event): void {
    this.departmentId = Number((event.target as HTMLInputElement).value);
    this.filterSize.setValue(this.sizeData);
    this.filterDepartment.setValue(this.departmentId);
    this.setValuesFilter(this.departmentId);
  }

  public cleanFilter(): void {
    this.filterDepartment.setValue('0');
    this.filterSize.setValue(this.sizeData);
    this.setValuesFilter(0);
  }

  public onChangeFilter(event: Event): void {
    let filterSize: number = Number((event.target as HTMLInputElement).value);
    this.filterSize.setValue(filterSize);
    this.setValuesFilter(this.departmentId);
  }

  private setValuesFilter(departmentId: number) {
    this.departmentId = departmentId;
    this._paginationService.setPage(0);
    this._paginationService.setPagination({
      page: 1,
      prev: 0,
      next: 0,
    });
  }

  private loadCategories(size: number = 10, page: number): void {
    this._categoriesService
      .getAllCategories(size, page, this.departmentId)
      .subscribe((categories) => {
        this.loading = false;
        this.loadingData = false;
        this.categories = categories;
      });
  }

  ngOnDestroy(): void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
    if (this.deleteCategorySubscription) {
      this.deleteCategorySubscription.unsubscribe();
    }

    if (this.paginationSubscription) {
      this._paginationService.setPage(0);
      this.paginationSubscription.unsubscribe();
    }
  }
}

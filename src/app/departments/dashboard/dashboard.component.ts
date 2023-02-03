import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaginationService } from 'src/app/shared/common/services/pagination.service';
import Swal from 'sweetalert2';
import { ListDepartments } from '../interfaces/list-departments';
import { DepartmentsService } from '../services/departments.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public departments!: ListDepartments;
  public departmentsSubscription!: Subscription;
  public deleteDepartmentSubscription!: Subscription;
  public loading: boolean = true;
  public loadingData: boolean = false;
  public paginationSubscription!: Subscription;
  public sizeData: number = 5;
  public filterSize: FormControl = new FormControl(this.sizeData);
  public sizePages: string[] = [];

  constructor(
    private _departmentsService: DepartmentsService,
    private _paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.sizePages = this._paginationService.sizePages;
    this.paginationSubscription = this._paginationService
      .getPage$()
      .subscribe((page) => {
        this.loadingData = true;
        console.log('Page: ', page);
        this.loadDepartments(Number(this.filterSize.value), page);
      });
  }

  /*public deleteDepartment(departmentId: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el departamento?',
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
        this.deleteDepartmentSubscription = this._departmentsService
          .deleteDepartment(departmentId)
          .subscribe({
            next: () => {
              Swal.fire(
                'Notificación del sistema',
                'Departamento eliminado con éxito.',
                'success'
              );
              this.filterSize.setValue(this.sizeData);
              this.loadDepartments(Number(this.filterSize.value), 0);
            },
            error: () => {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al eliminar departamento',
                'error'
              );
              this.filterSize.setValue(this.sizeData);
              this.loadDepartments(Number(this.filterSize.value), 0);
            },
          });
      }
    });
  }*/

  public onChangeFilterSize(event: Event): void {
    let filterSize: number = Number((event.target as HTMLInputElement).value);
    this.filterSize.setValue(filterSize);
    this.setValuesFilter();
  }

  private setValuesFilter() {
    this._paginationService.setPage(0);
    this._paginationService.setPagination({
      page: 1,
      prev: 0,
      next: 0,
    });
  }

  private loadDepartments(size: number = 10, page: number): void {
    this._departmentsService
      .getAllDepartments(size, page)
      .subscribe((departments) => {
        this.loading = false;
        this.loadingData = false;
        this.departments = departments;
      });
  }

  ngOnDestroy(): void {
    if (this.departmentsSubscription) {
      this.departmentsSubscription.unsubscribe();
    }
    if (this.deleteDepartmentSubscription) {
      this.deleteDepartmentSubscription.unsubscribe();
    }

    if (this.paginationSubscription) {
      this._paginationService.setPage(0);
      this.paginationSubscription.unsubscribe();
    }
  }
}

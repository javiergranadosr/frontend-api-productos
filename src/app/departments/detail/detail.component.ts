import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Codes } from 'src/app/shared/common/enum/codes';
import { CommonService } from 'src/app/shared/common/services/common.service';
import Swal from 'sweetalert2';
import { Content } from '../interfaces/list-departments';
import { DepartmentsService } from '../services/departments.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
  public departmentId: number = 0;
  public detailDepartment!: Content;
  private _detailSubscription!: Subscription;

  constructor(
    private _activedRouter: ActivatedRoute,
    private _departmentService: DepartmentsService,
    private _router: Router,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    if (
      this._activedRouter.snapshot.params['id'] &&
      this._activedRouter.snapshot.params['id'].length > 0
    ) {
      this.departmentId = Number(this._activedRouter.snapshot.params['id']);
      this._detailSubscription = this._departmentService
        .getDepartmentById(this.departmentId)
        .subscribe({
          next: (department) => {
            this.detailDepartment = department;
          },
          error: (error) => {
            if (
              error.status === Codes.CODE_404 ||
              error.status === Codes.CODE_400
            ) {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al obtener información  del departamento',
                'error'
              );
              this._router.navigate(['/departments']);
            }
          },
        });
    }
  }

  public get photoDepartment(): string {
    return this._commonService.showPhoto(this.detailDepartment.image, 'departments');
  }

  ngOnDestroy(): void {
    this.departmentId = 0;
    if (this._detailSubscription) {
      this._detailSubscription.unsubscribe();
    }
  }
}

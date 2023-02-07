import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Codes } from 'src/app/shared/common/enum/codes';
import { FieldErrors } from 'src/app/shared/common/interfaces/field-errors';
import Swal from 'sweetalert2';
import { Content } from '../interfaces/list-departments';
import { DepartmentsService } from '../services/departments.service';
import { Department } from '../interfaces/create-department';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _activatedRouter = inject(ActivatedRoute);
  private _departmentService = inject(DepartmentsService);
  private _router = inject(Router);

  public form!: FormGroup;
  public fieldErrors!: FieldErrors;
  public errors: string[] = [];
  public departmentId: number = 0;
  public department!: Content;
  public detailSubscription!: Subscription;
  public updateSubscription!: Subscription;

  ngOnInit(): void {
    this.initForm();
    this.setDataInForm();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: Department = {
        name: this.form.get('name')?.value,
        keyDepartment: this.form.get('keyDepartment')?.value,
      };
      this.updateSubscription = this._departmentService
        .update(this.departmentId, data)
        .subscribe({
          next: (response) => {
            Swal.fire(
              'Notificación del sistema ',
              'Departamento actualizado con éxito',
              'success'
            );
            this._router.navigate(['/departments']);
          },
          error: (err) => {
            if (err.status === Number(Codes.CODE_400)) {
              console.log(err);
              this.fieldErrors = err.error as FieldErrors;
            }
            if (err.status === Codes.CODE_404) {
              console.log(err);
            } else {
              Swal.fire(
                'Notificación del sistema ',
                'Hubo un error al actualizar el departamento',
                'error'
              );
              this._router.navigate(['/departments']);
            }
          },
        });
    } else {
      this.getFormValidationErrors();
    }
  }

  public validateForm(field: string): boolean {
    return (
      this.form.get(field)!.getError('minlength') ||
      this.form.get(field)!.getError('maxlength')
    );
  }

  private initForm(): void {
    this.form = this._fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      keyDepartment: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  private setDataInForm(): void {
    if (
      this._activatedRouter.snapshot.params['id'] &&
      this._activatedRouter.snapshot.params['id'].length > 0
    ) {
      this.departmentId = Number(this._activatedRouter.snapshot.params['id']);
      this.detailSubscription = this._departmentService
        .getDepartmentById(Number(this._activatedRouter.snapshot.params['id']))
        .subscribe({
          next: (department) => {
            this.department = department;
            this.form.get('name')?.setValue(department.name);
            this.form.get('keyDepartment')?.setValue(department.keyDepartment);
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

  private getFormValidationErrors(): void {
    this.errors = [];
    Object.keys(this.form.controls).forEach((key) => {
      const controlErrors: ValidationErrors | null = this.form.get(key)!.errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach((keyError) => {
          if (keyError === 'required') {
            this.errors.push(
              `${this._departmentService.getKeyForm(key)} es requerido.`
            );
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.detailSubscription) {
      this.detailSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
}

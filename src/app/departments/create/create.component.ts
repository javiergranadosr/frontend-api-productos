import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldErrors } from 'src/app/shared/common/interfaces/field-errors';
import { DepartmentsService } from '../services/departments.service';
import { Department } from '../interfaces/create-department';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Codes } from 'src/app/shared/common/enum/codes';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private _fb = inject(FormBuilder);
  private _departmentService = inject(DepartmentsService);
  private _createSubscription!: Subscription;
  private _router = inject(Router);

  public form!: FormGroup;
  public fieldErrors!: FieldErrors;
  public errors: string[] = [];

  ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: Department = {
        keyDepartment: this.form.get('keyDepartment')?.value,
        name: this.form.get('name')?.value,
      };
      this._createSubscription = this._departmentService
        .create(data)
        .subscribe({
          next: (response) => {
            Swal.fire(
              'Notificación del sistema ',
              'Departamento creado con éxito',
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
            }
          },
        });
    } else {
      this.getFormValidationErrors();
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

  ngOnDestroy(): void {
    if (this._createSubscription) {
      this._createSubscription.unsubscribe();
    }
  }
}

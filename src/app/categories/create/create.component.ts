import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Codes } from 'src/app/shared/common/enum/codes';
import { Department } from 'src/app/shared/common/interfaces/common';
import { FieldErrors } from 'src/app/shared/common/interfaces/field-errors';
import { CommonService } from 'src/app/shared/common/services/common.service';
import Swal from 'sweetalert2';
import { Category } from '../interfaces/create-category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private _commonService = inject(CommonService);
  private _fb = inject(FormBuilder);
  private _categoriesService = inject(CategoriesService);
  private _router = inject(Router);
  private _createSubscription!: Subscription;

  public departments$!: Observable<Department[]>;
  public form!: FormGroup;
  public fieldErrors!: FieldErrors;
  public errors: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.departments$ = this._commonService.getAllDepartments();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: Category = {
        name: this.form.get('name')?.value,
        departmentId: this.form.get('departmentId')?.value,
      };
      this._createSubscription = this._categoriesService
        .create(data)
        .subscribe({
          next: (response) => {
            Swal.fire(
              'Notificación del sistema ',
              'Categoría creada con éxito',
              'success'
            );
            this._router.navigate(['/categories']);
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
              `${this._categoriesService.getKeyForm(key)} es requerido.`
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
      departmentId: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    if (this._createSubscription) {
      this._createSubscription.unsubscribe();
    }
  }
}

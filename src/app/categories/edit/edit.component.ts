import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Codes } from 'src/app/shared/common/enum/codes';
import { Department } from 'src/app/shared/common/interfaces/common';
import { FieldErrors } from 'src/app/shared/common/interfaces/field-errors';
import { CommonService } from 'src/app/shared/common/services/common.service';
import Swal from 'sweetalert2';
import { Category } from '../interfaces/create-category';
import { Content } from '../interfaces/list-category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  private _fb = inject(FormBuilder);
  private _commonService = inject(CommonService);
  private _activatedRouter = inject(ActivatedRoute);
  private _categoriesService = inject(CategoriesService);
  private _router = inject(Router);

  public departments$!: Observable<Department[]>;
  public form!: FormGroup;
  public fieldErrors!: FieldErrors;
  public errors: string[] = [];
  public categoryId: number = 0;
  public category!: Content;
  public detailSubscription!: Subscription;
  public updateSubscription!: Subscription;
  public uploadSubscription!: Subscription;
  private photoSelected: File | null = null;

  ngOnInit(): void {
    this.initForm();
    this.departments$ = this._commonService.getAllDepartments();
    this.setDataInForm();
  }

  public selectPhoto(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.photoSelected = target.files ? target.files[0] : null;
    if (
      this.photoSelected?.type.indexOf('image') &&
      this.photoSelected?.type.indexOf('image') < 0
    ) {
      Swal.fire(
        'Notificación del sistema',
        'Formato invalido de imagen, solo se permiten los siguientes formatos: PNG, JPEG y JPG.',
        'error'
      );
      this.photoSelected = null;
    }
  }

  public get photoCategory(): string {
    return this._commonService.showPhoto(this.category.image, 'categories');
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: Category = {
        name: this.form.get('name')?.value,
        departmentId: this.form.get('departmentId')?.value,
      };
      this.updateSubscription = this._categoriesService
        .update(this.categoryId, data)
        .subscribe({
          next: (response) => {
            if (this.photoSelected) {
              this.uploadSubscription = this._commonService
                .uploadPhoto(
                  this.category.id,
                  this.photoSelected!,
                  'categories'
                )
                .subscribe({
                  next: (response) => {
                    Swal.fire(
                      'Notificación del sistema ',
                      'categoría actualizada con éxito',
                      'success'
                    );
                    this._router.navigate(['/categories']);
                  },
                  error: (err) => {
                    Swal.fire(
                      'Notificación del sistema ',
                      'Hubo un error al actualizar la categoría',
                      'error'
                    );
                    this._router.navigate(['/categories']);
                  },
                });
            } else {
              Swal.fire(
                'Notificación del sistema ',
                'categoría actualizada con éxito',
                'success'
              );
              this._router.navigate(['/categories']);
            }
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
                'Hubo un error al actualizar la categoría',
                'error'
              );
              this._router.navigate(['/categories']);
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

  private setDataInForm(): void {
    if (
      this._activatedRouter.snapshot.params['id'] &&
      this._activatedRouter.snapshot.params['id'].length > 0
    ) {
      this.categoryId = Number(this._activatedRouter.snapshot.params['id']);
      this.detailSubscription = this._categoriesService
        .getCategoryById(Number(this._activatedRouter.snapshot.params['id']))
        .subscribe({
          next: (category) => {
            this.category = category;
            this.form.get('name')?.setValue(category.name);
            this.form.get('departmentId')?.setValue(category.department.id);
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

  ngOnDestroy(): void {
    if (this.detailSubscription) {
      this.detailSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    this.photoSelected = null;
  }
}

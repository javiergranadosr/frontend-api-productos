import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Codes } from 'src/app/shared/common/enum/codes';
import { Category, Department } from 'src/app/shared/common/interfaces/common';
import { FieldErrors } from 'src/app/shared/common/interfaces/field-errors';
import { CommonService } from 'src/app/shared/common/services/common.service';
import Swal from 'sweetalert2';
import { Product } from '../interfaces/create-product';
import { Content } from '../interfaces/list-products';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  private _fb = inject(FormBuilder);
  private _commonService = inject(CommonService);
  private _activatedRouter = inject(ActivatedRoute);
  private _productService = inject(ProductsService);
  private _router = inject(Router);

  public departments$!: Observable<Department[]>;
  public categories$!: Observable<Category[]>;
  public form!: FormGroup;
  public fieldErrors!: FieldErrors;
  public errors: string[] = [];
  public productId: number = 0;
  public product!: Content;
  public detailSubscription!: Subscription;
  public updateSubscription!: Subscription;
  public uploadSubscription!: Subscription;
  private photoSelected: File | null = null;

  ngOnInit(): void {
    this.initForm();
    this.departments$ = this._commonService.getAllDepartments();
    this.setDataInForm();
  }

  public onChange(event: any): void {
    this.form.get('categoryId')?.setValue('');
    this.categories$ = this._commonService.getAllCategories(
      Number(event.target.value)
    );
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

  public get photoProduct(): string {
    return this._commonService.showPhoto(this.product.image, 'products');
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const data: Product = {
        name: this.form.get('name')?.value,
        brand: this.form.get('brand')?.value,
        model: this.form.get('model')?.value,
        price: this.form.get('price')?.value,
        discount: this.form.get('discount')?.value,
        categoryId: this.form.get('categoryId')?.value,
      };
      this.updateSubscription = this._productService
        .update(this.productId, data)
        .subscribe({
          next: (response) => {
            if (this.photoSelected) {
              this.uploadSubscription = this._commonService
                .uploadPhoto(this.product.id, this.photoSelected!, 'products')
                .subscribe({
                  next: (response) => {
                    Swal.fire(
                      'Notificación del sistema ',
                      'Producto actualizado con éxito',
                      'success'
                    );
                    this._router.navigate(['/products']);
                  },
                  error: (err) => {
                    Swal.fire(
                      'Notificación del sistema ',
                      'Hubo un error al actualizar el producto',
                      'error'
                    );
                    this._router.navigate(['/products']);
                  },
                });
            } else {
              Swal.fire(
                'Notificación del sistema ',
                'Producto actualizado con éxito',
                'success'
              );
              this._router.navigate(['/products']);
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
                'Hubo un error al actualizar el producto',
                'error'
              );
              this._router.navigate(['/products']);
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
      brand: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(200),
        ],
      ],
      model: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      price: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      department: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
    });
  }

  private setDataInForm(): void {
    if (
      this._activatedRouter.snapshot.params['id'] &&
      this._activatedRouter.snapshot.params['id'].length > 0
    ) {
      this.productId = Number(this._activatedRouter.snapshot.params['id']);
      this.detailSubscription = this._productService
        .getProductById(Number(this._activatedRouter.snapshot.params['id']))
        .subscribe({
          next: (product) => {
            this.product = product;
            this.categories$ = this._commonService.getAllCategories(
              Number(product.category.department.id)
            );
            this.form.get('name')?.setValue(product.name);
            this.form.get('brand')?.setValue(product.brand);
            this.form.get('model')?.setValue(product.model);
            this.form.get('price')?.setValue(product.price);
            this.form.get('discount')?.setValue(product.discount);
            this.form
              .get('department')
              ?.setValue(product.category.department.id);
            this.form.get('categoryId')?.setValue(product.category.id);
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

  private getFormValidationErrors(): void {
    this.errors = [];
    Object.keys(this.form.controls).forEach((key) => {
      const controlErrors: ValidationErrors | null = this.form.get(key)!.errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach((keyError) => {
          if (keyError === 'required') {
            this.errors.push(
              `${this._productService.getKeyForm(key)} es requerido.`
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

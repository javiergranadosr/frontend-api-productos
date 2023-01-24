import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, switchMap, of } from 'rxjs';
import { Category, Department } from 'src/app/shared/common/interfaces/common';
import { CommonService } from 'src/app/shared/common/services/common.service';
import { Product } from '../interfaces/create-product';
import { ProductsService } from '../services/products.service';
import { Codes } from '../../shared/common/enum/codes';
import { FieldErrors } from 'src/app/shared/common/interfaces/field-errors';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  private _commonService = inject(CommonService);
  private _fb = inject(FormBuilder);
  private _productsService = inject(ProductsService);
  private _router = inject(Router);

  public departments$!: Observable<Department[]>;
  public categories$!: Observable<Category[]>;
  public form!: FormGroup;
  public fieldErrors!: FieldErrors;
  public errors: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.departments$ = this._commonService.getAllDepartments();

    this.form.get('department')?.valueChanges.subscribe((department) => {
      if ((department as string).length > 0) {
        this.categories$ = this._commonService.getAllCategories(
          Number(department)
        );
      } else {
        this.categories$ = of([]);
      }
    });
    // Otra forma de realizarlo con  switchMap
    /*
    this.form
      .get('department')
      ?.valueChanges.pipe(
        switchMap((department$) => {
          return department$;
        })
      )
      .subscribe((department) => {
        if ((department as string).length > 0) {
          this.categories$ = this._commonService.getAllCategories(
            Number(department)
          );
        }
      });*/
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
      this._productsService.create(data).subscribe({
        next: (response) => {
          Swal.fire('Notificación del sistema ', 'Producto creado con éxito', 'success');
          this._router.navigate(['/products']);
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
              `${this._productsService.getKeyForm(key)} es requerido.`
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
}

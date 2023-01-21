import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }

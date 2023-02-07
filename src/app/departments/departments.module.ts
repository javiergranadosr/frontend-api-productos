import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CreateComponent,
    DetailComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    DepartmentsRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DepartmentsModule { }

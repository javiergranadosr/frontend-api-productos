import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Productos',
  },
  {
    path: 'create',
    component: CreateComponent,
    title: 'Nuevo producto',
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    title: 'Detalle del producto',
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    title: 'Editar producto',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}

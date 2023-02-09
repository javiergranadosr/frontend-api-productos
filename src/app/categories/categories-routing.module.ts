import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: ' Categorías',
  },
  {
    path: 'create',
    component: CreateComponent,
    title: 'Crear categoría',
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    title: 'Detalle de la categoría',
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    title: 'Editar categoría',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}

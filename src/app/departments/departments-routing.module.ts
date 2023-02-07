import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Departamentos',
  },
  {
    path: 'create',
    component: CreateComponent,
    title: 'Crear departamento',
  },
  {
    path: 'detail/:id',
    component: DetailComponent,
    title: 'Detalle del departamento',
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    title: 'Editar departamento',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}

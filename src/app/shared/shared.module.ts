import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormatDiscountPipe } from './common/pipes/format-discount.pipe';
import { LoadingComponent } from './loading/loading.component';
import { PaginationComponent } from './pagination/pagination.component';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FormatDiscountPipe,
    LoadingComponent,
    PaginationComponent,
    NotificationComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    NavbarComponent,
    FormatDiscountPipe,
    LoadingComponent,
    PaginationComponent,
    NotificationComponent
  ],
})
export class SharedModule {}

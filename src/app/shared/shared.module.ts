import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormatDiscountPipe } from './common/pipes/format-discount.pipe';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [NavbarComponent, FormatDiscountPipe, LoadingComponent],
  imports: [CommonModule, RouterModule],
  exports: [NavbarComponent, FormatDiscountPipe, LoadingComponent]
})
export class SharedModule {}

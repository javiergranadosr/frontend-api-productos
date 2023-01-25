import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormatDiscountPipe } from './common/pipes/format-discount.pipe';

@NgModule({
  declarations: [NavbarComponent, FormatDiscountPipe],
  imports: [CommonModule, RouterModule],
  exports: [NavbarComponent, FormatDiscountPipe]
})
export class SharedModule {}

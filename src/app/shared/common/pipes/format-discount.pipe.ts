import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDiscount',
})
export class FormatDiscountPipe implements PipeTransform {
  transform(discount: number): unknown {
    return {
      '0': '0',
      '0.0': '0',
      '0.1': '10',
      '0.2': '20',
      '0.3': '30',
      '0.4': '40',
      '0.5': '50',
      '0.6': '60',
      '0.7': '70',
      '0.8': '80',
      '0.9': '90',
    }[discount];
  }
}

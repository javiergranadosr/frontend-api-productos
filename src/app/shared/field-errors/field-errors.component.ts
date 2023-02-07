import { Component, Input } from '@angular/core';
import { FieldErrors } from '../common/interfaces/field-errors';

@Component({
  selector: 'app-field-errors',
  templateUrl: './field-errors.component.html',
  styleUrls: ['./field-errors.component.css']
})
export class FieldErrorsComponent {
  @Input() public fieldErrors!: FieldErrors;
}

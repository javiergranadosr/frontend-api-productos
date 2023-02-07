import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-back',
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.css'],
})
export class ButtonBackComponent {
  @Input() public url: string = '';
}

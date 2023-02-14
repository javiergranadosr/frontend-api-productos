import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  public toggle: boolean = false;

  public openMenu(): void {
    this.toggle = !this.toggle;
  }
}

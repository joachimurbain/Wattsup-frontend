import { Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-nav-bar',
  imports: [MenubarModule],
  template: ` <p-menubar [model]="items()"></p-menubar> `,
  styles: ``,
})
export class NavBarComponent {
  items = input.required<MenuItem[]>();
}

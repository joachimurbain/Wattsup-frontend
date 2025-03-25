import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavBarComponent } from './ui/nav-bar/nav-bar.component';

@Component({
  selector: 'app-menu',
  imports: [NavBarComponent],
  template: `<app-nav-bar [items]="items" />`,
  styles: ``,
})
export default class MenuComponent {
  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
    },
    {
      label: 'Stores',
      icon: 'pi pi-home',
    },
    {
      label: 'Meters',
      icon: 'pi pi-home',
    },
    {
      label: 'Requests',
      icon: 'pi pi-home',
    },
    {
      label: 'Meter Readings',
      icon: 'pi pi-home',
    },
    {
      label: 'Users',
      icon: 'pi pi-home',
    },
    {
      label: 'Notifications',
      icon: 'pi pi-home',
    },
  ];
}

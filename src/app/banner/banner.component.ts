import { Component } from '@angular/core';
import { HeaderLogoComponent } from './ui/banner-logo/header-logo.component';
import { HeaderUserMenuComponent } from './ui/header-user-menu/header-user-menu.component';

@Component({
  selector: 'app-banner',
  imports: [HeaderLogoComponent, HeaderUserMenuComponent],
  template: `
    <div class="w-80">
      <app-header-logo />
    </div>
    <app-header-user-menu />
  `,
  styles: ``,
})
export class BannerComponent {}

import { Component, computed, input } from '@angular/core';
import { HeaderLogoComponent } from './ui/header-logo.component';
import { HeaderUserMenuComponent } from './ui/header-user-menu.component';


@Component({
  selector: 'app-banner',
  imports: [HeaderLogoComponent, HeaderUserMenuComponent],
  template: `
	<div class="flex items-center place-content-between bg-primary-800 p-2">
    	<app-header-logo />
		<span class="text-white text-4xl font-semibold">BackOffice</span>
    	<app-header-user-menu [userName]="user()" />
	</div>
  `,
  styles: ``,
})
export class BannerComponent {
  user = computed(() => 'Joachim');

}

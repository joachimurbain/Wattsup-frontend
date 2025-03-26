import { Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
	selector: 'app-header-user-menu',
	imports: [ButtonModule, TieredMenu, Avatar],
	template: `
		<div class="flex items-center gap-2">
			<span class="font-medium hidden md:inline text-white">{{ userName() }}</span>
			<!-- User Avatar -->
			<p-avatar label="{{ userName()[0] }}" shape="circle" styleClass="bg-primary text-white cursor-pointer" size="normal" (click)="userMenu.toggle($event)" />

			<p-tieredMenu [model]="menuItems" #userMenu popup="true"> </p-tieredMenu>
		</div>
	`,
	styles: ``,
})
export class HeaderUserMenuComponent {
	userName = input<string>('User');
	logout = output<void>();
	openProfile = output<void>();

	menuItems: MenuItem[] = [
		{
			label: 'Profile',
			icon: 'pi pi-user',
			command: () => this.openProfile.emit(),
		},
		{
			label: 'Logout',
			icon: 'pi pi-sign-out',
			command: () => this.logout.emit(),
		},
	];
}

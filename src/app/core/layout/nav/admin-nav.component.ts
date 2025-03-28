import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
	selector: 'app-admin-nav',
	imports: [MenubarModule],
	template: `<p-menubar [model]="items"></p-menubar>`,
	styles: ``,
})
export default class AdminNavComponent {
	items: MenuItem[] = [
		{
			label: 'Dashboard',
			icon: 'pi pi-chart-line', // For an overview/analytics dashboard,
			routerLink: 'dashboard',
		},
		{
			label: 'Stores',
			icon: 'pi pi-building', // Represents locations/stores
			routerLink: 'stores',
		},
		{
			label: 'Meters',
			icon: 'pi pi-sliders-h', // Suggests meter controls or settings
		},
		{
			label: 'Requests',
			icon: 'pi pi-inbox', // For pending or submitted requests
		},
		{
			label: 'Meter Readings',
			icon: 'pi pi-pencil', // Represents manual entry / data input
		},
		{
			label: 'Users',
			icon: 'pi pi-users', // For user management
		},
		{
			label: 'Notifications',
			icon: 'pi pi-bell', // Classic bell icon for alerts/notifications
		},
	];
}

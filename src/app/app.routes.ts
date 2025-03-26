import { Routes } from '@angular/router';
import { STORE_ROUTES } from './stores/store.route';

export const routes: Routes = [
	{
		path:'dashboard',
		loadComponent: () => import('./admin-dashboard/admin-dashboard.component')
	},
	{ path: 'stores', children: STORE_ROUTES },

	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
];

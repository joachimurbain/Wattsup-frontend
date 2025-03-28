import { Routes } from '@angular/router';

export const STORE_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./store-list/stores.component'),
	},
	{
		path: ':storeId',
		loadComponent: () => import('./store/store.component'),
		children: [
			{ path: '', redirectTo: 'details', pathMatch: 'full' },
			{ path: 'details', loadComponent: () => import('./store/ui/store-details.component') },
			{ path: 'meters', loadComponent: () => import('./store/ui/store-meter-list.component') },
		],
	},
];

// { path: 'new', loadComponent: () => import('./store-edit/store-edit.component') },
// { path: ':id/edit', loadComponent: () => import('./store-edit/store-edit.component') },

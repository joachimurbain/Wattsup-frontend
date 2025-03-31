import { Routes } from '@angular/router';
import { storeResolver } from './resolver/store.resolver';

export const STORE_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./store-list/store-list.component'),
	},
	{
		path: ':storeId',
		loadComponent: () => import('./store/store.component'),
		resolve: { store: storeResolver },
		children: [
			// redirect directly to 'details'
			{
				path: '',
				redirectTo: 'details',
				pathMatch: 'full',
			},

			// route with tabs
			{
				path: '',
				loadComponent: () => import('./store/ui/store-tabs/store-tabs.component'),
				children: [
					{
						path: 'details',
						loadComponent: () => import('./store/ui/store-details/store-details.component'),
					},
					{
						path: 'meters',
						loadComponent: () => import('./store/ui/store-meter-list/store-meter-list.component'),
					},
				],
			},

			// full-page (no-tabs) routes
			{
				path: 'meters/new',
				loadComponent: () => import('./store/ui/store-meter-create/store-meter-create.component'),
			},
			{
				path: 'meters/:meterId',
				loadComponent: () => import('../meter-readings/meter-reading-list/meter-reading-list.component'),
			},
		],
	},
];

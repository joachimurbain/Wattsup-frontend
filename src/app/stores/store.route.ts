import { Routes } from "@angular/router";

export const STORE_ROUTES: Routes = [
  { path: '',
			loadComponent: () => import('./store-list/stores.component')
	}
		,
  { path: 'new',
			loadComponent: () => import('./store-edit/store-edit.component')
	},
  { path: ':id/edit',
		loadComponent: () => import('./store-edit/store-edit.component')
	 },
];
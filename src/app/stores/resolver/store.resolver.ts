import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StoreService } from '../data-access/store.service';

export const storeResolver: ResolveFn<boolean> = (route, state) => {
	const storeService = inject(StoreService);
	const storeId = Number(route.paramMap.get('storeId'));

	if (storeId) {
		storeService.getOne$.next(storeId);
	}

	return true;
};

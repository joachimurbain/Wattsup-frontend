import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MeterService } from '../data-access/meter.service';

export const meterResolver: ResolveFn<boolean> = (route, state) => {
	const meterService = inject(MeterService);
	const meterId = Number(route.paramMap.get('meterId'));

	if (meterId) {
		meterService.loadOne(meterId);
	}

	return true;
};

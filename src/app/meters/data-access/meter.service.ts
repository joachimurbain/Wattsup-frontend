import { computed, Injectable, signal } from '@angular/core';
import { EntityStateService } from '../../core/data-access/entity-state.service';
import { HttpClient } from '@angular/common/http';
import { Meter } from './meter.model';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, EMPTY, BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MeterService extends EntityStateService<Meter> {
	getByStoreId$ = new BehaviorSubject<number | null>(null);
	currentStoreId = signal<number | null>(null);

	metersOfCurrentStore = computed(() => {
		const id = this.currentStoreId();
		if (id === null) {
			return [];
		}

		return Object.values(this.fullItems()).filter((m) => m.storeId === id);
	});

	constructor(httpClient: HttpClient) {
		super(httpClient, 'store');

		this.getByStoreId$
			.pipe(
				takeUntilDestroyed(),
				switchMap((storeId) => {
					if (storeId === null) {
						return EMPTY;
					}

					this.currentStoreId.set(storeId);
					const url = `${environment.apiUrl}store/${storeId}/meters`;

					return this.httpClient.get<Meter[]>(url);
				})
			)
			.subscribe({
				next: (meters) => {
					const newItems = Object.fromEntries(meters.map((m) => [m.id, m]));

					this.state.update((state) => ({
						...state,
						fullItems: {
							...state.fullItems,
							...newItems,
						},
						error: null,
					}));
				},
				error: (err) => {
					console.error(err);
					this.state.update((s) => ({
						...s,
						error: 'Failed to load meters',
					}));
				},
			});
	}
}

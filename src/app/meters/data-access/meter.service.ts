import { computed, effect, Injectable, signal } from '@angular/core';
import { EntityStateService } from '../../core/data-access/entity-state.service';
import { HttpClient } from '@angular/common/http';
import { Meter } from './meter.model';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, EMPTY, BehaviorSubject, finalize } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MeterService extends EntityStateService<Meter> {
	private readonly _loadByStoreId = signal<number | null>(null);

	// Cache of meters grouped by store ID
	private readonly _metersByStore = signal<Record<number, Meter[]>>({});

	// Selector to get meters for any store
	public readonly metersByStore = (storeId: number) => computed(() => this._metersByStore()[storeId] ?? []);

	constructor(http: HttpClient) {
		super(http, 'meter');

		// Load meters for store when requested
		effect(() => {
			const storeId = this._loadByStoreId();
			if (storeId == null) {
				return;
			}
			const url = `${environment.apiUrl}store/${storeId}/meters`;

			this.isLoading.set(true);
			this.error.set(null);

			this.httpClient
				.get<Meter[]>(url)
				.pipe(finalize(() => this.isLoading.set(false)))
				.subscribe({
					next: (meters) => {
						this._metersByStore.update((prev) => ({
							...prev,
							[storeId]: meters,
						}));
					},
					error: (err) => {
						console.error(err);
						this.error.set('Failed to load meters');
					},
				});

			this._loadByStoreId.set(null); // reset trigger
		});
	}

	// Public trigger
	public loadMetersForStore(storeId: number) {
		this._loadByStoreId.set(storeId);
	}
}

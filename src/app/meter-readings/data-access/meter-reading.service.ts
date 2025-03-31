import { computed, effect, Injectable, signal } from '@angular/core';
import { MeterReading } from './meter-reading.model';
import { EntityState, EntityStateService } from '../../core/data-access/entity-state.service';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Subject, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface MeterReadingState extends EntityState<MeterReading> {
	readingsByMeter: Record<number, MeterReading[]>;
}

@Injectable({
	providedIn: 'root',
})
export class MeterReadingService extends EntityStateService<MeterReading> {
	protected override state = signal<MeterReadingState>({
		summaries: [],
		fullItems: {},
		readingsByMeter: {},
		error: null,
	});

	getByMeterId$ = new Subject<number>();

	readingsByMeter = computed(() => this.state().readingsByMeter);

	constructor(httpClient: HttpClient) {
		super(httpClient, 'MeterReading');

		this.getByMeterId$
			.pipe(
				switchMap((meterId) => this.httpClient.get<MeterReading[]>(`${environment.apiUrl}meter/${meterId}/readings`))
			)
			.subscribe({
				next: (readings) => {
					const meterId = readings[0]?.meterId;
					if (meterId) {
						this.state.update((state) => ({
							...state,
							readingsByMeter: {
								...state.readingsByMeter,
								[meterId]: readings.map((item) => this.mapFromApi(item)),
							},
							error: null,
						}));
					}
				},
				error: (err) => {
					console.error(err);
					this.state.update((s) => ({
						...s,
						error: 'Failed to load meters',
					}));
				},
			});

		effect(() => {
			const updated = this.lastUpdated();
			if (!updated) {
				return;
			}
			const meterId = updated.meterId;
			if (meterId) {
				this.getByMeterId$.next(meterId);
			}
		});
	}

	protected override mapFromApi(reading: MeterReading): MeterReading {
		return {
			...reading,
			readingDate: new Date(reading.readingDate + 'Z'),
		};
	}
}

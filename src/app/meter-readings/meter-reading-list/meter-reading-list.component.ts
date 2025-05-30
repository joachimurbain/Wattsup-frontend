import { Component, computed, effect, inject, signal } from '@angular/core';
import { MeterReadingTableComponent } from './ui/meter-reading-table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CreateMeterReading, MeterReading } from '../data-access/meter-reading.model';
import { MeterReadingService } from '../data-access/meter-reading.service';
import { MenuItem } from 'primeng/api';
import { MeterService } from '../../meters/data-access/meter.service';

@Component({
	selector: 'app-meter-readings',
	imports: [MeterReadingTableComponent],
	template: `
		<app-meter-reading-table
			[loading]="meterReadingService.isLoading()"
			[readings]="readings()"
			[columns]="columns()"
			(createNew)="$event.meterId = meterId()!; meterReadingService.create($event)"
			(edit)="meterReadingService.update($event)"
			(delete)="meterReadingService.delete($event.id)"
		/>
	`,
	styles: `

	`,
})
export default class MeterReadingsComponent {
	private route = inject(ActivatedRoute);
	meterReadingService = inject(MeterReadingService);
	meterService = inject(MeterService);

	meterId = toSignal(this.route.paramMap.pipe(map((params) => Number(params.get('meterId')))));

	readings = computed(() => {
		const meterId = this.meterId();
		return meterId ? this.meterReadingService.readingsByMeter()[meterId] : [];
	});

	columns = signal<MenuItem[]>([
		{ field: 'value', header: 'Value' },
		{ field: 'readingDate', header: 'Date' },
		{ field: 'actions', header: '' },
	]);

	constructor() {
		effect(() => {
			const meterId = this.meterId();
			if (meterId) {
				this.meterReadingService.getByMeterId$.next(meterId);
			}
		});
	}
}

import { Component, computed, effect, inject, signal } from '@angular/core';
import { MeterReadingTableComponent } from './ui/meter-reading-table.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MeterReading } from '../data-access/meter-reading.model';
import { MeterReadingService } from '../data-access/meter-reading.service';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-meter-readings',
	imports: [MeterReadingTableComponent],
	template: `
		<app-meter-reading-table
			[readings]="readings()"
			[columns]="columns()"
			(edit)="onEdit($event)"
			(delete)="onDelete($event)"
		/>
	`,
	styles: `

	`,
})
export default class MeterReadingsComponent {
	private route = inject(ActivatedRoute);
	private meterReadingService = inject(MeterReadingService);

	meterId = toSignal(
		this.route.paramMap.pipe(
			// grab the meterId from the route
			map((params) => Number(params.get('meterId')))
		)
	);

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

	onDelete($event: MeterReading) {
		throw new Error('Method not implemented.');
	}
	onEdit(meterReading: MeterReading) {
		this.meterReadingService.update$.next(meterReading);
	}
}

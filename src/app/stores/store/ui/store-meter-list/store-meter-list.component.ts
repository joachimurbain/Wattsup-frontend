import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MeterService } from '../../../../meters/data-access/meter.service';
import { Meter } from '../../../../meters/data-access/meter.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MeterTableComponent } from '../../../../meters/meter-list/ui/meter-table.component';
import { PTableColumn } from '../../../../shared/interfaces/ptable-column';
import { HeaderComponent } from '../../../../shared/ui/header/header.component';
import { DialogModule } from 'primeng/dialog';

@Component({
	standalone: true,
	selector: 'app-store-meter-list',
	imports: [CommonModule, TableModule, ButtonModule, MessageModule, MeterTableComponent, DialogModule],
	template: `
		<app-meter-table
			[columns]="columns"
			[meters]="meters()"
			(createNew)="createNew()"
			(rowClick)="openReadings($event)"
			(terminateMeter)="openTerminate($event)"
			(downloadQr)="downloadQr($event)"
		></app-meter-table>
	`,
})
export default class StoreMeterListComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private meterService = inject(MeterService);

	params = toSignal(this.route.parent!.paramMap);
	storeId = computed(() => Number(this.params()?.get('storeId')));
	isCreateDialogOpen = signal(false);
	meters = this.meterService.metersByStore(this.storeId());

	columns: PTableColumn[] = [
		{ field: 'type', header: 'Type' },
		{ field: 'lastReading', header: 'Last Reading' },
		{ field: 'status', header: 'Status' },
		{ field: 'actions', header: '' },
	];

	constructor() {
		effect(() => {
			if (this.storeId()) {
				this.meterService.loadMetersForStore(this.storeId());
			}
		});

		effect(() => {
			const created = this.meterService.created();
			if (created && created.storeId === this.storeId()) {
				this.meterService.loadMetersForStore(this.storeId());
			}
		});
	}

	createNew() {
		this.router.navigate(['new'], { relativeTo: this.route });
	}

	openReadings(meter: Meter) {
		this.router.navigate([meter.id], { relativeTo: this.route });
	}

	openTerminate(meter: Meter) {
		throw new Error('Method not implemented.');

		console.log('Terminate meter:', meter);
	}

	downloadQr(meter: Meter) {
		const link = document.createElement('a');
		link.href = meter.qrCode;
		link.download = `${meter.uuid}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

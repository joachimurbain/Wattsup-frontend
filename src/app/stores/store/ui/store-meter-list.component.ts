import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MeterService } from '../../../meters/data-access/meter.service';
import { Meter } from '../../../meters/data-access/meter.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { MeterTableComponent } from '../../../meters/ui/meter-table.component';
import { PTableColumn } from '../../../shared/interfaces/ptable-column';
import { HeaderComponent } from "../../../shared/ui/header/header.component";
import { DialogModule } from 'primeng/dialog';
import { ModalComponent } from "../../../shared/ui/modal/modal.component";

@Component({
	standalone: true,
	selector: 'app-store-meter-list',
	imports: [CommonModule, TableModule, ButtonModule, MessageModule, MeterTableComponent, DialogModule, ModalComponent],
	template: `

	<app-meter-table
		[columns]="columns"
		[meters]="meters()"
		(createNew)="isCreateDialogOpen.set(true)"
		(rowClick)="openReadings($event)"
		(terminateMeter)="openTerminate($event)"
	></app-meter-table>

	<app-modal [title]="'Create Meter'" [isOpen]="isCreateDialogOpen()" (close)="isCreateDialogOpen.set(false)" >

      <!-- TODO: app-meter-form -->
      <p class="text-sm text-gray-500">Meter form goes here…</p>
	</app-modal>


	`,
})
export default class StoreMeterListComponent {
	private route = inject(ActivatedRoute);
	private meterService = inject(MeterService);

	params = toSignal(this.route.parent!.paramMap);
	storeId = computed(() => Number(this.params()?.get('storeId')));
	isCreateDialogOpen = signal(false);
	meters = computed(() => this.meterService.metersOfCurrentStore());

	columns: PTableColumn[] = [
		{ field: 'type', header: 'Type' },
		{ field: 'lastReading', header: 'Last Reading' },
		{ field: 'status', header: 'Status' },
		{ field: 'actions', header: '' },
	];

	constructor() {
		effect(() => {
			if (this.storeId()) {
				this.meterService.getByStoreId$.next(this.storeId());
			}
		});
	}


	openReadings(meter: Meter) {
		console.log('View readings for:', meter);
	}

	openTerminate(meter: Meter) {
		console.log('Terminate meter:', meter);
	}

	downloadQr(meter: Meter) {
		const link = document.createElement('a');
		link.href = meter.QrCode;
		link.download = `${meter.uuid}.png`;
		link.click();
	}
}

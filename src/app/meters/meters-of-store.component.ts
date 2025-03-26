import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MeterService } from './data-access/meter.service';
import { MeterTableComponent } from "./ui/meter-table.component";
import { PTableColumn } from '../shared/interfaces/ptable-column';

@Component({
  selector: 'app-meters-of-store',
  imports: [MeterTableComponent],
  template: `
    <div class="mt-10 border-t pt-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Meters</h3>
        <button pButton icon="pi pi-plus" label="Add Meter" (click)="openCreateDialog()"></button>
      </div>

      <app-meter-table
				[columns]="columns()"
        [meters]="meters()"
        (rowClick)="openReadingsDialog($event)"
        (terminateMeter)="openTerminateDialog($event)"
      ></app-meter-table>

			@if(isCreateDialogOpen()){
				<!-- <app-meter-form-dialog
					[storeId]="storeId()"
					(close)="closeCreateDialog()"
				></app-meter-form-dialog> -->
			}
    </div>
  `,
  styles: ``
})
export default class MetersOfStoreComponent {
  private meterService = inject(MeterService);

  storeId = input.required<number>();
  isCreateDialogOpen = signal(false);


	columns = signal<PTableColumn[]>([
		// { field: 'uuid', header: 'UUID' },
		{ field: 'type', header: 'Type' },
		{ field: 'status', header: 'Status' },
		{ field: 'actions', header: '' }
	]);

	meters = computed(() => this.meterService.metersOfCurrentStore());

  constructor() {
		effect(() => {
			const id = this.storeId();
			if (id !== null) {
				this.meterService.getByStoreId$.next(id);
			}
		});
  }

  openCreateDialog() {
    this.isCreateDialogOpen.set(true);
  }

  closeCreateDialog() {
    this.isCreateDialogOpen.set(false);
  }

  openReadingsDialog(meter: any) {
    console.log('TODO: open readings for meter', meter);
  }

  openTerminateDialog(meter: any) {
    console.log('TODO: terminate meter', meter);
  }
}

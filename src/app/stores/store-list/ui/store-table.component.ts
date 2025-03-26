import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Store } from '../../data-access/store.model';
import { PTableColumn } from '../../../shared/interfaces/ptable-column';
import { NgClass, NgSwitch } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
	selector: 'app-store-table',
	imports: [TableModule, NgClass, ButtonModule,MessageModule],
	template: `
		<p-table [columns]="columns()" [value]="stores()" [paginator]="true" [rows]="10">
			<ng-template #header let-columns>
				<tr>
					@for (col of columns; track $index) {
					<th [ngClass]="col.header == 'Status' ? 'w-1/40 text-center':''">{{ col.header }}</th>
					}
				</tr>
			</ng-template>
			<ng-template #body let-rowData let-columns="columns">
				<tr>
					@for (col of columns; track $index) { @switch (col.field) {
					<!-- prettier-ignore -->
					@case ('status'){
					<td >
						<p-message [severity]="rowData.active ? 'success' : 'warn'" size="small">{{ rowData.active ? 'Active' : 'Inactive' }}</p-message>
					</td>
					} @default {
					<td>{{ rowData[col.field] }}</td>
					} } }
				</tr></ng-template
			>
		</p-table>
	`,
	styles: ``,
})
export class StoreTableComponent {
	stores = input<Store[]>([]);

	columns = input.required<PTableColumn[]>();

	edit = output<Store>();
	toggleActive = output<Store>();
}

import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Store, StoreLight } from '../../data-access/store.model';
import { PTableColumn } from '../../../shared/interfaces/ptable-column';
import { NgClass, NgSwitch } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
	selector: 'app-store-table',
	imports: [TableModule, NgClass, ButtonModule, MessageModule],
	template: `
		<p-table [columns]="columns()" [value]="stores()" [paginator]="true" [rows]="10" [rowHover]="true">
			<ng-template #header let-columns>
				<tr>
					@for (col of columns; track $index) {
					<th [ngClass]="col.header == 'Status' ? 'w-1/40 text-center' : ''">{{ col.header }}</th>
					}
				</tr>
			</ng-template>
			<ng-template #body let-rowData let-columns="columns">
				<tr (click)="edit.emit(rowData)" class="cursor-pointer">
					@for (col of columns; track $index) { @switch (col.field) {
					<!-- prettier-ignore -->
					@case ('status'){
					<td>
						<!-- {{rowData.isActive}} -->
						<p-message [severity]="rowData.isActive ? 'success' : 'warn'" size="small" styleClass="statusCol">{{
							rowData.isActive ? 'Active' : 'Inactive'
						}}</p-message>
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
	stores = input<StoreLight[]>([]);

	columns = input.required<PTableColumn[]>();

	edit = output<Store>();
}

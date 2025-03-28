import { CommonModule } from '@angular/common';
import { Component, input, output, ViewChild } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Meter } from '../data-access/meter.model';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Menu, MenuModule } from 'primeng/menu';

@Component({
	selector: 'app-meter-table',
	imports: [TableModule, MessageModule, CommonModule, ButtonModule, SplitButtonModule,MenuModule],
	template: `
		<p-table [value]="meters()" [columns]="columns()" dataKey="id" class="p-datatable-sm">
			<ng-template #caption>
				<div class="flex items-center justify-between">
					<h1 class="text-xl font-bold">Meters</h1>
					<p-button icon="pi pi-plus" rounded raised (onClick)="createNew.emit()" />
				</div>
			</ng-template>

			<!-- HEADER -->
			<ng-template #header let-columns>
				<tr>
					@for (col of columns; track $index) {
					<th
						[ngClass]="
							col.header === 'Status'
								? 'text-center w-1/5 text-center'
								: col.field === 'actions'
								? 'text-right w-1/8'
								: ''
						"
					>
						{{ col.header }}
					</th>
					}
				</tr>
			</ng-template>

			<!-- BODY -->
			<ng-template #body let-rowData let-columns="columns">
				<tr (click)="rowClick.emit(rowData)" class="cursor-pointer hover:bg-surface-100">
					@for (col of columns; track $index) { @switch (col.field) {
					<!-- prettier-ignore -->
					@case ('status') {
					<td class="text-center">
						<p-message
							[severity]="!rowData.deactivationDate ? 'success' : 'warn'"
							[text]="
								!rowData.deactivationDate ? 'Active' : 'Terminated: ' + (rowData.deactivationDate | date : 'dd/MM/YYYY')
							"
							size="small"
							styleClass="statusCol"
						/>
					</td>
					} @case ('actions') {
					<td class="text-right space-x-2" (click)="$event.stopPropagation()">
						@if(!rowData.deactivationDate){
						<!-- Download QR -->
						<!-- <p-button icon="pi pi-download" class=" " (click)="downloadQr.emit(rowData)" /> -->

						<!-- Terminate -->
						<!-- <p-button icon="pi pi-power-off" class=" p-button-danger" (click)="terminateMeter.emit(rowData)" /> -->





						<p-menu #menu [model]="rowMenuItems(rowData)" [popup]="true" appendTo="body" />

<p-button
	icon="pi pi-ellipsis-v"
	class="p-button-text p-button-sm"
	(click)="menu.toggle($event)"
/>
						}
					</td>
					} @default {
					<td>{{ rowData[col.field] }}</td>
					} } }
				</tr>
			</ng-template>
		</p-table>
	`,
	styles: [
		`
			.test .p-message-text {
				color: red !important;
			}
		`,
	],
})
export class MeterTableComponent {
	@ViewChild('menu') menu!: Menu;
	meters = input.required<Meter[]>();
	columns = input.required<Array<{ field: string; header: string }>>();

	createNew = output<void>();
	rowClick = output<Meter>();
	terminateMeter = output<Meter>();
	downloadQr = output<Meter>();

	rowMenuItems = (meter: Meter): MenuItem[] => {
		const actions: MenuItem[] = [
			{
				label: 'Download QR',
				icon: 'pi pi-download',
				command: () => this.downloadQr.emit(meter),
			},
			{
				label: 'Terminate',
				icon: 'pi pi-power-off',
				command: () => this.terminateMeter.emit(meter),
				styleClass: 'text-red-600'
			},
		];
		return actions;
	};
}

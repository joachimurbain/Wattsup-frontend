import { CommonModule } from '@angular/common';
import { Component, input, output, ViewChild } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Meter } from '../../data-access/meter.model';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Menu, MenuModule } from 'primeng/menu';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-meter-table',
	imports: [TableModule, MessageModule, CommonModule, ButtonModule, SplitButtonModule, MenuModule],
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
						<p-menu
							[tabindex]="undefined"
							#menu
							[model]="(dynamicMenuItems$ | async)!"
							(onShow)="showMenu(rowData)"
							[popup]="true"
							appendTo="body"
						/>

						<p-button severity="info" icon="pi pi-ellipsis-v" class=" p-button-sm" (click)="menu.toggle($event)" />
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

	public dynamicMenuItems$: BehaviorSubject<MenuItem[]> = new BehaviorSubject([] as MenuItem[]);

	public showMenu(meter: Meter): void {
		this.dynamicMenuItems$.next([
			{
				label: 'Download QR',
				icon: 'pi pi-download',
				command: () => this.downloadQr.emit(meter),
			},
			{
				label: 'Terminate',
				icon: 'pi pi-power-off',
				command: () => this.terminateMeter.emit(meter),
				styleClass: 'text-red-600',
			},
		]);
	}
}

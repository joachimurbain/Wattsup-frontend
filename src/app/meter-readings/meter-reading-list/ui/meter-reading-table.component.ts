import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MeterReading } from '../../data-access/meter-reading.model';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { MeterService } from '../../../meters/data-access/meter.service';

@Component({
	selector: 'app-meter-reading-table',
	imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, InputNumberModule, DatePickerModule],
	template: `
		<p-table [value]="readings()" [columns]="columns()" dataKey="id" editMode="row" class="p-datatable-sm">
			<ng-template #header let-cols>
				<tr>
					@for (col of cols; track $index) {
					<th [ngClass]="col.field === 'actions' ? 'text-right w-1/6' : ''">
						{{ col.header }}
					</th>
					}
				</tr>
			</ng-template>

			<ng-template #body let-reading let-cols="columns" let-editing="editing" let-ri="rowIndex">
				<tr [pEditableRow]="reading">
					@for (col of cols; track $index) { @switch (col.field) {
					<!-- prettier-ignore -->
					@case ('value') {
					<td>
						<p-cellEditor>
							<ng-template #input>
								<p-inputNumber [(ngModel)]="getRowModel(reading).value" [min]="0" inputClass="w-full" />
							</ng-template>
							<ng-template #output>
								{{ reading.value }}
							</ng-template>
						</p-cellEditor>
					</td>
					} @case ('readingDate') {
					<td>
						<p-cellEditor>
							<ng-template #input>
								<p-datepicker
									[(ngModel)]="getRowModel(reading).readingDate"
									inputClass="w-full"
									dateFormat="dd/mm/yy"
									appendTo="body"
									showIcon
									[showTime]="true"
									hourFormat="24"
								/>
							</ng-template>
							<ng-template #output>
								{{ reading.readingDate | date : 'dd/MM/YYYY HH:mm' }}
							</ng-template>
						</p-cellEditor>
					</td>
					} @case ('actions') {
					<td class="text-right space-x-2">
						<div class="flex justify-end gap-2">
							@if(editing){
							<p-button
								pButton
								pSaveEditableRow
								icon="pi pi-check"
								rounded
								severity="secondary"
								(click)="onRowEditSave(reading)"
							/>
							<p-button
								pButton
								pCancelEditableRow
								icon="pi pi-times"
								rounded
								severity="secondary"
								(click)="onRowEditCancel(reading)"
							/>
							} @else {
							<p-button
								pButton
								pInitEditableRow
								icon="pi pi-pencil"
								(click)="onRowEditInit(reading)"
								rounded
								severity="secondary"
							/>

							<p-button pButton icon="pi pi-trash" (click)="delete.emit(reading)" rounded severity="danger" />

							}
						</div>
					</td>
					} } }
				</tr>
			</ng-template>
		</p-table>
	`,
})
export class MeterReadingTableComponent {
	readings = input.required<MeterReading[]>();
	columns = input.required<MenuItem[]>();

	edit = output<MeterReading>();
	cancel = output<MeterReading>();
	delete = output<MeterReading>();

	private clonedReadings: Record<number, MeterReading> = {};

	onRowEditInit(reading: MeterReading) {
		this.clonedReadings[reading.id] = { ...reading };
	}

	getRowModel(reading: MeterReading): MeterReading {
		return this.clonedReadings[reading.id];
	}

	onRowEditSave(reading: MeterReading) {
		this.edit.emit(this.clonedReadings[reading.id]);
		delete this.clonedReadings[reading.id];
	}

	onRowEditCancel(reading: MeterReading) {
		delete this.clonedReadings[reading.id];
	}
}

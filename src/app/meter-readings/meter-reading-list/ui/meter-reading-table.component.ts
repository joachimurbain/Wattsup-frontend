import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CreateMeterReading, MeterReading, MeterReadingSource } from '../../data-access/meter-reading.model';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { MeterService } from '../../../meters/data-access/meter.service';
import { SkeletonModule } from 'primeng/skeleton';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';

@Component({
	selector: 'app-meter-reading-table',
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		InputNumberModule,
		DatePickerModule,
		SkeletonModule,
		ModalComponent,
	],
	template: `
		<p-table
			[value]="readings()"
			[columns]="columns()"
			dataKey="id"
			editMode="row"
			class="p-datatable-sm"
			[loading]="loading()"
		>
			<ng-template #caption>
				<div class="flex items-center justify-between">
					<h1 class="text-xl font-bold">Meters</h1>
					<p-button icon="pi pi-plus" rounded raised (onClick)="startCreating()" />
				</div>
			</ng-template>
			<ng-template #header let-cols>
				<tr>
					@for (col of cols; track $index) {
					<th [ngClass]="col.field === 'actions' ? 'text-right w-1/6' : ''">
						{{ col.header }}
					</th>
					}
				</tr>
			</ng-template>

			<!-- <ng-template #emptymessage>
				@if(isCreating()){
				<ng-container *ngTemplateOutlet="createRow"></ng-container>
				}
			</ng-template> -->

			<ng-template #body let-reading let-cols="columns" let-editing="editing" let-ri="rowIndex">
				<!-- @if(isCreating()){
				<ng-container *ngTemplateOutlet="createRow"></ng-container>
				} -->
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
			<ng-template pTemplate="loadingbody" let-columns="columns">
				<tr style="height:46px; border-bottom: 1px solid #dee2e6;">
					@for (col of columns; track col.field; let even = $even) {
					<td>
						<p-skeleton [ngStyle]="{ background: 'black', width: even ? '40%' : '60%' }" height="1rem" />
					</td>
					}
				</tr>
			</ng-template>

			<!-- <ng-template #createRow>
				<tr class="bg-gray-50 border border-gray-200 rounded-md">
					<td>
						<p-inputNumber [(ngModel)]="newReading.value" [min]="0" inputClass="w-full" />
					</td>
					<td>
						<p-datepicker
							[(ngModel)]="newReading.readingDate"
							inputClass="w-full"
							dateFormat="dd/mm/yy"
							appendTo="body"
							showIcon
							[showTime]="true"
							hourFormat="24"
						/>
					</td>
					<td class="text-right space-x-2">
						<div class="flex justify-end gap-2">
							<p-button icon="pi pi-check" rounded severity="success" (click)="saveCreating()" />
							<p-button icon="pi pi-times" rounded severity="secondary" (click)="cancelCreating()" />
						</div>
					</td>
				</tr>
			</ng-template> -->
		</p-table>

		<app-modal [title]="'Create meter reading'" [isOpen]="isCreating()" (close)="cancelCreating()">
			<div class="flex flex-col md:flex-row gap-4 px-4 pt-2">
				<div class="w-full md:w-1/2">
					<label class="block mb-1 text-sm font-medium text-gray-700">Value</label>
					<p-inputNumber [(ngModel)]="newReading.value" inputClass="w-full" placeholder="e.g. 5000" />
				</div>

				<div class="w-full md:w-1/2">
					<label class="block mb-1 text-sm font-medium text-gray-700">Date & Time</label>
					<p-datepicker
						[(ngModel)]="newReading.readingDate"
						inputClass="w-full"
						dateFormat="dd/mm/yy"
						appendTo="body"
						showIcon
						[showTime]="true"
						hourFormat="24"
						placeholder="Select date"
					/>
				</div>
			</div>

			<div class="flex justify-end gap-2 mt-6 px-4 pb-2">
				<p-button label="Save" icon="pi pi-check" (click)="saveCreating()" />
				<p-button label="Cancel" icon="pi pi-times" (click)="cancelCreating()" severity="secondary" />
			</div>
		</app-modal>
	`,
	styles: [``],
})
export class MeterReadingTableComponent {
	loading = input<boolean>(true);
	readings = input.required<MeterReading[]>();
	columns = input.required<MenuItem[]>();

	edit = output<MeterReading>();
	createNew = output<CreateMeterReading>();
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

	readonly isCreating = signal(false);

	newReading: CreateMeterReading = {
		value: null,
		readingDate: new Date(),
		source: MeterReadingSource.Manual,
		meterId: 0,
	};

	saveCreating() {
		this.createNew.emit(this.newReading);
		this.isCreating.set(false);
	}
	cancelCreating() {
		this.isCreating.set(false);

		this.newReading.value = null;
		this.newReading.readingDate = new Date();
	}

	startCreating() {
		this.isCreating.set(true);
		this.newReading = {
			value: null,
			readingDate: new Date(),
			source: MeterReadingSource.Manual,
			meterId: 0,
		};
	}
}

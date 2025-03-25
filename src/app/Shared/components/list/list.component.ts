import { Component, Signal, input, output } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PrimeNgTableColumn } from '../../Interfaces/primeNg-table-column';
import { FieldPipe } from '../../pipes/field.pipe';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-list',
	imports: [TableModule, ButtonModule, FieldPipe, DatePipe],
	template: `
		<div class="card">
			<p-table
				[value]="items()"
				[columns]="columns()"
				[tableStyle]="{ 'min-width': '50rem' }"
			>
				<ng-template #header let-columns>
					<tr>
						@for (col of columns; track $index) {
						<th>{{ col.header }}</th>
						}
						<th>Actions</th>
					</tr>
				</ng-template>
				<ng-template #body let-rowData let-columns="columns">
					<tr>
						@for (col of columns; track $index) {
						<td>
							@if(col.formatType =='date'){

							{{ rowData | field : col | date : col.format }}

							}@else {

							{{ rowData | field : col }}
							}
						</td>
						}
						<td>
							<p-button
								icon="pi pi-pencil"
								(click)="edit.emit(rowData.id)"
							></p-button>
							<p-button
								icon="pi pi-trash"
								class="ml-2"
								severity="danger"
								(click)="delete.emit(rowData.id)"
							></p-button>
						</td>
					</tr>
				</ng-template>
			</p-table>
		</div>
	`,
	styles: ``,
})
export class ListComponent<T> {
	items = input.required<T[]>();
	columns = input.required<PrimeNgTableColumn[]>();

	edit = output<number>();
	delete = output<number>();
}

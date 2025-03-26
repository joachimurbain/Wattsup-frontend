import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Meter } from '../data-access/meter.model';

@Component({
  selector: 'app-meter-table',
  imports: [TableModule,MessageModule,CommonModule],
  template: `
    <p-table
      [value]="meters()"
      [columns]="columns()"
      dataKey="id"
      class="p-datatable-sm"
    >
      <ng-template #header let-columns>
        <tr>
          @for (col of columns(); track $index) {
            <th [ngClass]="col.header === 'Status' ? 'text-center w-1/6' : ''">
              {{ col.header }}
            </th>
          }
        </tr>
      </ng-template>

      <ng-template #body let-rowData let-columns="columns">
        <tr (click)="rowClick.emit(rowData)">
          @for (col of columns(); track $index) {
            @switch (col.field) {

              @case ('status') {
                <td class="text-center">
                  <p-message
                    [severity]="!rowData.deactivationDate ? 'success' : 'warn'"
                    size="small"
                  >
                    {{ !rowData.deactivationDate ? 'Active' : ('Terminated: ' + (rowData.deactivationDate | date:'shortDate')) }}
                  </p-message>
                </td>
              }

              @case ('actions') {
                <td class="text-right">
                  <button
                    *ngIf="!rowData.deactivationDate"
                    pButton
                    icon="pi pi-power-off"
                    class="p-button-text p-button-sm p-button-danger"
                    (click)="onTerminateClick($event, rowData)"
                  ></button>
                </td>
              }

              @default {
                <td>{{ rowData[col.field] }}</td>
              }
            }
          }
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: ``
})
export class MeterTableComponent {
  meters = input.required<Meter[]>();
  columns = input.required<Array<{ field: string; header: string }>>();

  rowClick = output<Meter>();
  terminateMeter = output<Meter>();

  onTerminateClick(event: MouseEvent, meter: Meter) {
    event.stopPropagation(); // prevent row click
    this.terminateMeter.emit(meter);
  }
}

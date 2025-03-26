import { Component, input } from '@angular/core';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

@Component({
	selector: 'app-dashboard-summary',
	imports: [SummaryCardComponent],
	template: `
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<app-summary-card
				icon="pi-building"
				label="Total Stores"
				[value]="storeCount()"
				color="bg-blue-100 text-blue-800"
			></app-summary-card>
			<app-summary-card
				icon="pi-bolt"
				label="Active Meters"
				[value]="meterCount()"
				color="bg-green-100 text-green-800"
			></app-summary-card>
			<app-summary-card
				icon="pi-envelope"
				label="Open Requests"
				[value]="openRequestCount()"
				color="bg-orange-100 text-orange-800"
			></app-summary-card>
			<app-summary-card
				icon="pi-exclamation-triangle"
				label="Unread Alerts"
				[value]="alertCount()"
				color="bg-red-100 text-red-800"
			></app-summary-card>
		</div>
	`,
	styles: ``,
})
export class DashboardSummaryComponent {
	storeCount = input.required<number>();
	meterCount = input.required<number>();
	openRequestCount = input.required<number>();
	alertCount = input.required<number>();
}

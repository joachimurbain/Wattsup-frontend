import { Component } from '@angular/core';
import { DashboardSummaryComponent } from './ui/dashboard-summary/dashboard-summary.component';
import { RecentAlertsComponent } from './ui/recent-alerts/recent-alerts.component';
import { QuickActionsComponent } from './ui/quick-actions/quick-actions.component';
import { AlertItem } from '../shared/interfaces/alert-item.interface';

@Component({
	selector: 'app-admin-dashboard',
	imports: [DashboardSummaryComponent, RecentAlertsComponent, QuickActionsComponent],
	template: `
		<div class="p-4 space-y-6">
			<h2 class="text-xl font-semibold mb-4">Welcome back, {{ adminName }}!</h2>
			<div>
				<app-dashboard-summary
					[storeCount]="storeCount"
					[meterCount]="meterCount"
					[openRequestCount]="openRequestCount"
					[alertCount]="alertCount"
				></app-dashboard-summary>
			</div>
			<div>
				<app-recent-alerts [alerts]="alerts"></app-recent-alerts>
			</div>
			<div>
				<app-quick-actions></app-quick-actions>
			</div>
		</div>
	`,
	styles: ``,
})
export default class AdminDashboardComponent {
	adminName = 'Joachim';
	storeCount = 12;
	meterCount = 45;
	openRequestCount = 8;
	alertCount = 2;

	alerts: AlertItem[] = [
		{
			message: 'Meter #23 at Brussels Center has abnormal consumption',
			type: 'error',
			timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
		},
		{
			message: 'Missing reading for Antwerp North – Electricity',
			type: 'warning',
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			message: 'Received reading from Mons-Water',
			type: 'info',
			timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 2 hours ago
		},
	];

	onCreateStore() {
		/* Navigate to add store */
	}
	onCreateMeter() {
		/* Navigate to add meter */
	}
	onCreateRequest() {
		/* Open modal or route */
	}
	onViewAnalytics() {
		/* Go to analytics view */
	}
}

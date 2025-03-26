import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

interface QuickAction {
	label: string;
	icon: string;
	routerLink: string[];
	styleClass?: string;
}

@Component({
	selector: 'app-quick-actions',
	imports: [ButtonModule, RouterLink, PanelModule],
	template: `
		<p-panel header="Quick Actions" styleClass="bg-white shadow-sm mb-6">
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
				@for (action of actions; track $index) {

				<button
					pButton
					[label]="action.label"
					[icon]="action.icon"
					[routerLink]="action.routerLink"
					[class]="action.styleClass + ' p-button-outlined w-full'"
				></button>
				}
			</div>
		</p-panel>
	`,
	styles: ``,
})
export class QuickActionsComponent {
	actions: QuickAction[] = [
		{
			label: 'Add Store',
			icon: 'pi pi-plus',
			routerLink: ['/stores/new'],
			styleClass: 'p-button-info',
		},
		{
			label: 'Add Meter',
			icon: 'pi pi-plus-circle',
			routerLink: ['/admin/meters/new'],
			styleClass: 'p-button-help',
		},
		{
			label: 'New Request',
			icon: 'pi pi-send',
			routerLink: ['/admin/requests/new'],
			styleClass: 'p-button-warning',
		},
		{
			label: 'View Analytics',
			icon: 'pi pi-chart-bar',
			routerLink: ['/admin/analytics'],
			styleClass: 'p-button-secondary',
		},
	];
}

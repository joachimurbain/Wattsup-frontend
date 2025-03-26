import { Component, input } from '@angular/core';
import { Panel } from 'primeng/panel';
import { AlertItem } from '../../../shared/interfaces/alert-item.interface';
import { TimeagoModule } from 'ngx-timeago';
import { NgClass } from '@angular/common';
import { PrimeIcons } from 'primeng/api';

@Component({
	selector: 'app-recent-alerts',
	imports: [NgClass, Panel, TimeagoModule],
	template: `
		<p-panel header="Recent Alerts" styleClass="shadow-sm">
			@if(alerts().length){
			<ul class="space-y-3">
				@for(alert of alerts(); track $index ){

				<li
					class="flex items-center gap-2 text-sm border-l-4 pl-2"
					[ngClass]="[alertStyles[alert.type].borderColor]"
				>
					<i
						class="pi"
						[ngClass]="[alertStyles[alert.type].icon,alertStyles[alert.type].iconColor]"
					>
					</i>

					<div class="flex flex-col">
						<span class="font-medium">{{ alert.message }}</span>
						<span class="text-xs text-gray-500">
							{{ alert.timestamp | timeago }}
						</span>
					</div>
				</li>
				}
			</ul>
			}@else {
			<div class="text-gray-500 text-sm italic">No recent alerts</div>
			}
		</p-panel>
	`,
	styles: ``,
})
export class RecentAlertsComponent {
	alerts = input.required<AlertItem[]>();

  alertStyles: Record<AlertItem['type'], { icon: string; iconColor: string; borderColor: string }> = {
    error: {
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      iconColor: 'text-red-500',
      borderColor: 'border-red-500'
    },
    warning: {
      icon: PrimeIcons.EXCLAMATION_CIRCLE,
      iconColor: 'text-yellow-500',
      borderColor: 'border-yellow-400'
    },
    info: {
      icon:PrimeIcons.INFO_CIRCLE,
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-400'
    }
  };
}

import { Component, computed, inject } from '@angular/core';
import { StoreHeaderComponent } from './ui/store-header.component';
import { TabsModule } from 'primeng/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-store',
	imports: [StoreHeaderComponent, TabsModule, RouterModule, CardModule],
	template: `
		<div class="p-6 max-w-6xl mx-auto space-y-6">
			<app-store-header [storeId]="storeId()" />
			<p-card>
				<div class="space-y-4">
					<p-tabs [value]="currentUrl()">
						<p-tablist>
							@for (tab of tabs; track tab.routerLink) {
							<p-tab [value]="tab.routerLink" [routerLink]="tab.routerLink">
								<i [class]="tab.icon" class="mr-1"></i>
								{{ tab.label }}
							</p-tab>
							}
						</p-tablist>
					</p-tabs>
					<div class="pt-4">
						<router-outlet />
					</div>
				</div>
			</p-card>
		</div>
	`,
	styles: ``,
})
export default class StoreComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);

	params = toSignal(this.route.paramMap);

	storeId = computed(() => Number(this.params()?.get('storeId')));

	currentUrl = computed(() => this.router.url.split('/').pop()!);

	tabs: MenuItem[] = [
		{
			label: 'Details',
			icon: PrimeIcons.INFO_CIRCLE,
			routerLink: 'details',
		},
		{
			label: 'Meters',
			icon: PrimeIcons.BOLT,
			routerLink: 'meters',
		},
		{
			label: 'Requests',
			icon: PrimeIcons.ENVELOPE,
			routerLink: 'requests',
		},
		{
			label: 'Alerts',
			icon: PrimeIcons.EXCLAMATION_TRIANGLE,
			routerLink: 'alerts',
		},
	];
}

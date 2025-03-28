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
							<p-tab [value]="tab.routerLink" [routerLink]="tab.routerLink" [hidden]="tab.disabled">
								<i [class]="tab.icon" class="mr-1"></i>
								{{ tab.label }}
							</p-tab>
							}
						</p-tablist>
					</p-tabs>
					<div class="pt-0">
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

	storeId = computed(() => {
		return this.params()?.get('storeId') === 'new' ? null : Number(Number(this.params()?.get('storeId')));
	});
	isNew = computed(() => this.params()?.get('storeId') === 'new' );

	currentUrl = computed(() => this.router.url.split('/').pop()!);

	tabs: MenuItem[] = [
		{
			label: 'Details',
			icon: PrimeIcons.INFO_CIRCLE,
			routerLink: 'details',
			disabled:false
		},
		{
			label: 'Meters',
			icon: PrimeIcons.BOLT,
			routerLink: 'meters',
			disabled:this.isNew()
		},
		{
			label: 'Requests',
			icon: PrimeIcons.ENVELOPE,
			routerLink: 'requests',
			disabled:this.isNew()

		},
		{
			label: 'Alerts',
			icon: PrimeIcons.EXCLAMATION_TRIANGLE,
			routerLink: 'alerts',
			disabled:this.isNew()

		},
	];
}

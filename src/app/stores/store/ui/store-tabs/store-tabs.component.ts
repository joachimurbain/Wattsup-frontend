import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
	selector: 'app-store-tabs',
	imports: [TabsModule, RouterLink, RouterOutlet],
	template: `
		<p-tabs [value]="activeTab()">
			<p-tablist>
				@for (tab of tabs; track tab.routerLink) {
				<p-tab [value]="tab.routerLink" [routerLink]="tab.routerLink" [hidden]="tab.disabled">
					<i [class]="tab.icon" class="mr-1"></i>
					{{ tab.label }}
				</p-tab>
				}
			</p-tablist>
		</p-tabs>
		<router-outlet />
	`,
	styles: ``,
})
export default class StoreTabsComponent {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	params = toSignal(this.route.paramMap);

	url = signal(this.router.url);

	constructor() {
		this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
			this.url.set(this.router.url);
		});
	}

	activeTab = computed(() => this.url().split('/').pop()!);

	isNew = computed(() => this.params()?.get('storeId') === 'new');

	tabs: MenuItem[] = [
		{
			label: 'Details',
			icon: PrimeIcons.INFO_CIRCLE,
			routerLink: 'details',
			disabled: false,
		},
		{
			label: 'Meters',
			icon: PrimeIcons.BOLT,
			routerLink: 'meters',
			disabled: this.isNew(),
		},
		{
			label: 'Requests',
			icon: PrimeIcons.ENVELOPE,
			routerLink: 'requests',
			disabled: this.isNew(),
		},
		{
			label: 'Alerts',
			icon: PrimeIcons.EXCLAMATION_TRIANGLE,
			routerLink: 'alerts',
			disabled: this.isNew(),
		},
	];
}

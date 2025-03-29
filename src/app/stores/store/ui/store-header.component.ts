import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { StoreService } from '../../data-access/store.service';

@Component({
	selector: 'app-store-header',
	standalone: true,
	imports: [BreadcrumbModule],
	template: `
		<div class="bg-white border border-gray-200 rounded-xl px-6 py-4 mb-6">
			<div class="space-y-2">
				<p-breadcrumb [model]="breadcrumbItems()" />

				@if (store(); as s) {
				<h1 class="text-xl font-semibold text-gray-800">
					{{ s.name }}
					<span class="text-gray-500 font-normal text-base">– {{ s.address }}</span>
				</h1>
				} @else {
				<h1 class="text-xl font-semibold text-gray-800">Create Store</h1>
				}
			</div>
		</div>
	`,
})
export class StoreHeaderComponent {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private storeService = inject(StoreService);

	private storeId = signal<number | null>(null);
	private meterId = signal<string | null>(null);
	private url = signal<string>('');

	store = computed(() => {
		const id = this.storeId();
		if (id !== null) {
			return this.storeService.fullItems()[id] ?? null;
		}
		return null;
	});

	constructor() {
		this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
			this.updateRouteState();
		});

		// Also run immediately for hard refresh / direct link
		this.updateRouteState();
	}

	private updateRouteState(): void {
		const allParams = this.collectAllParams();
		const storeId = allParams.get('storeId');
		const meterId = allParams.get('meterId');

		this.storeId.set(storeId ? Number(storeId) : null);
		this.meterId.set(meterId ?? null);
		this.url.set(this.router.url);
	}

	private collectAllParams(): Map<string, string> {
		const params = new Map<string, string>();
		let current: ActivatedRoute | null = this.route;

		while (current) {
			const snapshot = current.snapshot.paramMap;

			for (const key of snapshot.keys) {
				const value = snapshot.get(key);
				if (value !== null && !params.has(key)) {
					params.set(key, value);
				}
			}

			current = current.parent;
		}

		return params;
	}

	readonly breadcrumbItems = computed<MenuItem[]>(() => this.buildBreadcrumbItems());

	private buildBreadcrumbItems(): MenuItem[] {
		const items: MenuItem[] = [{ label: 'Stores', routerLink: '/stores' }];
		const store = this.store();
		const url = this.url();
		const storeId = this.storeId();
		const meterId = this.meterId();

		const add = (label: string, path: string) => {
			if (storeId !== null) {
				items.push({ label, routerLink: `/stores/${storeId}/${path}` });
			}
		};

		if (store) {
			add(store.name, 'details');
		} else {
			add('New', 'details');
		}

		if (url.includes('/details')) {
			add('Details', 'details');
		}

		if (url.includes('/meters')) {
			add('Meters', 'meters');

			if (url.endsWith('/new')) {
				items.push({ label: 'New' });
			} else if (meterId) {
				items.push({ label: `#${meterId}` });
			}
		}

		if (url.includes('/alerts')) {
			add('Alerts', 'alerts');
		}

		if (url.includes('/requests')) {
			add('Requests', 'requests');
		}

		// Make last breadcrumb non-clickable
		if (items.length > 0) {
			delete items[items.length - 1].routerLink;
		}

		return items;
	}
}

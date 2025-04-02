import { Component, computed, effect, inject, signal } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs';
import { StoreService } from '../../data-access/store.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MeterService } from '../../../meters/data-access/meter.service';

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
	private meterService = inject(MeterService);

	storeId$ = this.route.paramMap.pipe(map((params) => params.get('storeId')));

	private paramMap$ = this.router.events.pipe(
		filter((e) => e instanceof NavigationEnd),
		startWith(null), // emit initial value on load
		map(() => {
			let r = this.route;
			while (r.firstChild) {
				r = r.firstChild;
			}
			return r;
		}),
		switchMap((r) => r.paramMap)
	);

	// Convert paramMap values to signals
	storeId = toSignal(this.storeId$, { initialValue: null });
	meterId = toSignal(this.paramMap$.pipe(map((p) => p.get('meterId'))), { initialValue: null });

	// URL signal if you still want it
	url = toSignal(
		this.router.events.pipe(
			filter((e) => e instanceof NavigationEnd),
			startWith(null),
			map(() => this.router.url)
		),
		{ initialValue: this.router.url }
	);

	meter = computed(() => {
		const id = this.meterId();
		return id ? this.meterService.fullItems()[+id] : null;
	});
	store = computed(() => {
		const id = this.storeId();
		return id ? this.storeService.fullItems()[+id] : null;
	});

	constructor() {
		effect(() => {
			console.log('storeId signal:', this.storeId());
		});
	}

	breadcrumbItems = computed<MenuItem[]>(() => {
		const store = this.store();
		const meter = this.meter();
		const url = this.url();
		this.meterService.fullItems();
		const items: MenuItem[] = [{ label: 'Stores', routerLink: '/stores' }];

		const add = (label: string, path: string) => {
			if (store) {
				items.push({ label, routerLink: `/stores/${store.id}/${path}` });
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
			if (meter) {
				items.push({ label: `${meter.type}` });
			} else if (url.endsWith('/new')) {
				items.push({ label: 'New' });
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
	});
}

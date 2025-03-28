import { Component, computed, effect, inject, input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StoreService } from '../../data-access/store.service';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-store-header',
	imports: [BreadcrumbModule],
	template: `
		<div class="bg-white border border-gray-200 rounded-xl px-6 py-4 mb-6">
			<div class="space-y-2">
				<div>
					<p-breadcrumb
						[model]="breadcrumbItems()"
						styleClass="!bg-transparent !border-none !shadow-none p-0 text-sm text-gray-500"
					/>
				</div>
				@if (store(); as s) {
				<h1 class="text-xl font-semibold text-gray-800">
					{{ s.name }}
					<span class="text-gray-500 font-normal text-base">– {{ s.address }}</span>
				</h1>
				}@else {
					<h1 class="text-xl font-semibold text-gray-800">Create Store</h1>
				}
			</div>
		</div>
	`,
	styles: ``,
})
export class StoreHeaderComponent {
	private storeService = inject(StoreService);
	storeId = input.required<number | null>();

	store = computed(() => {
		const storeId = this.storeId();
		return storeId !== null ? this.storeService.fullItems()[storeId] : null;
	});

	breadcrumbItems = computed<MenuItem[]>(() => {
		const base = [{ label: 'Stores', routerLink: '/stores' }];

		const store = this.store();
		if (store) {
			return store ? [...base, { label: store.name }] : base;
		}else{
			return [...base, { label: 'Create Store' }];
		}

	});

	constructor() {
		effect(() => {
			const id = this.storeId();
			if (id) {
				this.storeService.getOne$.next(id);
			}
		});
	}
}

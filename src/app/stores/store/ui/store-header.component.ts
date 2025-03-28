import { Component, computed, effect, inject, input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StoreService } from '../../data-access/store.service';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-store-header',
	imports: [BreadcrumbModule],
	template: `
		<div class="bg-white border border-gray-200 rounded-xl px-6 py-4 mb-6">
			@if (store(); as s) {
			<div class="space-y-2">
				<div>
					<p-breadcrumb
						[model]="breadcrumbItems()"
						styleClass="!bg-transparent !border-none !shadow-none p-0 text-sm text-gray-500"
					/>
				</div>

				<h1 class="text-xl font-semibold text-gray-800 leading-snug">
					{{ s.name }}
					<span class="text-gray-500 font-normal text-base">– {{ s.address }}</span>
				</h1>
			</div>
			}
		</div>
	`,
	styles: ``,
})
export class StoreHeaderComponent {
	private storeService = inject(StoreService);
	storeId = input.required<number>();

	store = computed(() => this.storeService.fullItems()[this.storeId()]);

	breadcrumbItems = computed<MenuItem[]>(() => {
		const store = this.store();
		return [{ label: 'Stores', routerLink: '/admin/stores' }, ...(store ? [{ label: store.name }] : [])];
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

import { Component, Signal, inject, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { StoreTableComponent } from './ui/store-table.component';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { Store, StoreLight } from '../data-access/store.model';
import { StoreService } from '../data-access/store.service';

@Component({
	selector: 'app-stores-list',
	imports: [CardModule, ButtonModule, StoreTableComponent, HeaderComponent],
	template: `
		<p-card class="shadow-sm">
			<ng-content #header>
				<app-header [title]="'Stores'" (onCreateNew)="onCreateNew()"></app-header>
			</ng-content>

			<app-store-table #body [stores]="stores()" [columns]="columns" (edit)="onEdit($event)"> </app-store-table>
		</p-card>
	`,
	styles: ``,
})
export default class StoresListComponent {
	router = inject(Router);
	storeService = inject(StoreService);

	stores: Signal<StoreLight[]>;

	columns = [
		{ field: 'name', header: 'Name' },
		{ field: 'address', header: 'Address' },
		{ field: 'surfaceArea', header: 'Surface (m²)' },
		{ field: 'status', header: 'Status' },
	];

	constructor() {
		this.storeService.getAll$.next();
		this.stores = this.storeService.summaries;
	}

	onEdit(store: Store) {
		this.router.navigate(['/stores', store.id]);
	}

	onCreateNew() {
		this.router.navigate(['/stores', 'new']);
	}
}

import { Component, inject, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { StoreTableComponent } from './ui/store-table.component';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { Store } from '../data-access/store.model';


@Component({
	selector: 'app-stores-list',
	imports: [CardModule, ButtonModule, StoreTableComponent, HeaderComponent],
	template: `
		<p-card class="shadow-sm">
			<ng-content #header>
				<app-header [title]="'Stores'" (onCreateNew)="onCreateNew()"></app-header>
			</ng-content>

			<app-store-table #body
				[stores]="stores()"
				[columns]="columns"
				(edit)="onEdit($event)"
			>
			</app-store-table>
		</p-card>
	`,
	styles: ``,
})
export default class StoresListComponent {
	router = inject(Router);
	stores = signal<Store[]>([
		{ id: 1, name: 'Brussels North', address: 'Rue A, 1050', surface: 250, active: true },
		{ id: 2, name: 'Antwerp South', address: 'Rue B, 2000', surface: 310, active: true },
		{ id: 3, name: 'Ghent Central', address: 'Rue C, 9000', surface: 190, active: false },
	]); // get list from StoreService.Items

	columns = [
		{ field: 'name', header: 'Name' },
		{ field: 'address', header: 'Address' },
		{ field: 'surface', header: 'Surface (m²)' },
		{ field: 'status', header: 'Status' },
	];

	onEdit(store: Store) {

		this.router.navigate(['/stores', store.id, 'edit']);
	}

	onCreateNew() {
		this.router.navigate(['/stores','new']);
	}
}

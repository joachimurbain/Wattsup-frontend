import { Component } from '@angular/core';
import { StoreHeaderComponent } from './ui/store-header.component';
import { TabsModule } from 'primeng/tabs';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
	selector: 'app-store',
	imports: [StoreHeaderComponent, TabsModule, RouterModule, CardModule],
	template: `
		<div class="p-4 max-w-6xl mx-auto">
			<app-store-header />
			<p-card>
				<router-outlet />
			</p-card>
		</div>
	`,
	styles: ``,
})
export default class StoreComponent {}

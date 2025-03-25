import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-header',
	imports: [ButtonModule],
	template: `
		<div
			class="flex justify-between  bg-white p-4 border-b-1  border-gray-200 "
		>
			<h1 class="text-2xl font-bold">{{ title() }}</h1>
			<p-button
				label="Create New"
				icon="pi pi-plus"
				(click)="onCreateNew.emit()"
			/>
		</div>
	`,
	styles: ``,
})
export class HeaderComponent {
	title = input<string>('');
	onCreateNew = output<void>();
}

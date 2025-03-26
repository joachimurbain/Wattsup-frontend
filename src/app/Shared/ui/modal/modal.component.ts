import { Component, computed, effect, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
	selector: 'app-modal',
	imports: [DialogModule],
	template: `
		<div class="card flex justify-center">
			<p-dialog
				[header]="title()"
				[modal]="true"
				[(visible)]="_isOpen"
				[style]="{ width: '50vw' }"
				(onHide)="close.emit()"
			>
				<ng-content />
			</p-dialog>
		</div>
	`,
	styles: ``,
})
export class ModalComponent {
	title = input.required<string>();
	close = output<void>();
	isOpen = input.required<boolean>();

	_isOpen: boolean = false;

	constructor() {
		effect(() => {
			this._isOpen = this.isOpen();
		});
	}
}

import { Component, Input, InputSignal, input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';

@Component({
	selector: 'app-validation',
	imports: [MessageModule],
	template: `
		@if( control().invalid && (control().touched || control().dirty)){
		<div class="ml-2">
			<p-message severity="error" variant="simple" size="small">
				<ng-content></ng-content>
			</p-message>
		</div>
		}
	`,
	styles: ``,
})
export class ValidationComponent {
	control = input.required<AbstractControl<any, any>>();
}

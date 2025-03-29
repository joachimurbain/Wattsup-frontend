import { Component, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MeterType } from '../../data-access/meter.model';
import { ButtonModule } from 'primeng/button';
import { ValidationComponent } from '../../../shared/ui/validation/validation.component';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
	selector: 'app-meter-form',
	imports: [ButtonModule, SelectModule, ValidationComponent, ReactiveFormsModule, FloatLabelModule],
	template: `
		<form [formGroup]="form()" (ngSubmit)="submitForm.emit()">
			<div class="space-y-4">
				<!-- Type -->
				<div class="w-full">
					<p-floatlabel>
						<p-select
							inputId="type"
							formControlName="type"
							[options]="meterTypes"
							optionLabel="label"
							optionValue="value"
							class="w-full"
						/>
						<label for="type" class="">Meter Type*</label>
					</p-floatlabel>
					<app-validation [control]="form().get('type')!">Type is required.</app-validation>
				</div>

				<!-- Submit Button -->
				<div>
					<p-button type="submit" label="Create Meter" class="w-full" />
				</div>
			</div>
		</form>
	`,
	styles: ``,
})
export class MeterFormComponent {
	form = input.required<FormGroup>();
	submitForm = output<void>();

	meterTypes = [
		{ label: 'Electricity', value: MeterType.Electricity },
		{ label: 'Gas', value: MeterType.Gas },
		{ label: 'Water', value: MeterType.Water },
	];
}

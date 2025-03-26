import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { ValidationComponent } from '../../../../shared/ui/validation/validation.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
	selector: 'app-store-form',
	imports: [ReactiveFormsModule, ButtonModule, InputNumber, ValidationComponent, FloatLabelModule,InputTextModule],
	template: `<form [formGroup]="form()" (ngSubmit)="submitForm.emit()" class="space-y-6">
		<!-- Name -->
		<div>
			<p-floatLabel>
				<input id="name" type="text" pInputText formControlName="name" class="w-full" />
				<label for="name" class="font-semibold">Name*</label>
			</p-floatLabel>
			<app-validation [control]="form().get('name')!"> Name is required. </app-validation>
		</div>

		<!-- Address -->
		<div>
			<p-floatLabel>
				<input id="address" type="text" pInputText formControlName="address" class="w-full" />
				<label for="address" class="font-semibold">Address*</label>
			</p-floatLabel>
			<app-validation [control]="form().get('address')!"> Address is required. </app-validation>
		</div>

		<!-- Surface -->
		<div>
			<p-floatLabel>
				<p-inputNumber id="surface" formControlName="surface" [min]="1" class="w-full" />
				<label for="surface" class="font-semibold">Surface (m²)*</label>
			</p-floatLabel>
			<app-validation [control]="form().get('surface')!"> Surface must be at least 1. </app-validation>
		</div>

		<!-- Submit -->
		<div class="pt-4">
			<p-button type="submit" [label]="isEdit() ? 'Update Store' : 'Create Store'" class="w-full" [disabled]="disabled()"/>
		</div>
	</form> `,
	styles: ``,
})
export class StoreFormComponent {
	form = input.required<FormGroup>();
	isEdit = input<boolean>(false);
	disabled = input<boolean>(false);

	submitForm = output<void>();
}

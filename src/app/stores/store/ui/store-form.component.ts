import { Component, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ValidationComponent } from '../../../shared/ui/validation/validation.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageModule } from 'primeng/message';

@Component({
	selector: 'app-store-form',
	imports: [
		ReactiveFormsModule,
		ButtonModule,
		InputNumberModule,
		ValidationComponent,
		FloatLabelModule,
		InputTextModule,
		ToggleSwitchModule,
		MessageModule,
	],
	template: `
		<form [formGroup]="form()" (ngSubmit)="submitForm.emit()">
			<div class="grid grid-cols-12 gap-8">
				<!-- Name (full width) -->
				<div class="col-span-12">
					<p-floatLabel>
						<input id="name" pInputText formControlName="name" class="w-full" />
						<label for="name" class="font-semibold">Name*</label>
					</p-floatLabel>
					<app-validation [control]="form().get('name')!">Name is required.</app-validation>
				</div>

				<!-- Store Code (1/2) -->
				<div class="col-span-12 md:col-span-6">
					<p-floatLabel>
						<input id="storeCode" pInputText formControlName="storeCode" class="w-full" />
						<label for="storeCode" class="font-semibold">Store Code*</label>
					</p-floatLabel>
					<app-validation [control]="form().get('storeCode')!">Required.</app-validation>
				</div>

				<!-- Surface Area (1/2) -->
				<div class="col-span-12 md:col-span-6">
					<p-floatLabel>
						<p-inputNumber inputId="surfaceArea" formControlName="surfaceArea" class="w-full" />
						<label for="surfaceArea" class="font-semibold">Surface (m²)*</label>
					</p-floatLabel>
					<app-validation [control]="form().get('surfaceArea')!">Must be ≥ 1.</app-validation>
				</div>

				<!-- Address (full width) -->
				<div class="col-span-12">
					<p-floatLabel>
						<input id="address" pInputText formControlName="address" class="w-full" />
						<label for="address" class="font-semibold">Address*</label>
					</p-floatLabel>
					<app-validation [control]="form().get('address')!">Required.</app-validation>
				</div>

				<!-- City (2/3) -->
				<div class="col-span-12 md:col-span-8">
					<p-floatLabel>
						<input id="city" pInputText formControlName="city" class="w-full" />
						<label for="city" class="font-semibold">City*</label>
					</p-floatLabel>
					<app-validation [control]="form().get('city')!">Required.</app-validation>
				</div>

				<!-- Zipcode (1/3) -->
				<div class="col-span-12 md:col-span-4">
					<p-floatLabel>
						<p-inputNumber inputId="zipcode" formControlName="zipcode" class="w-full" />
						<label for="zipcode" class="font-semibold">Zipcode*</label>
					</p-floatLabel>
					<app-validation [control]="form().get('zipcode')!">Required.</app-validation>
				</div>

				<!-- Status Toggle -->
				<div class="col-span-12 mt-2">
					<label for="isActive" class="font-semibold block mb-1">Status</label>

					<div class="flex items-center gap-3">
						<p-toggleswitch formControlName="isActive" inputId="isActive" />

						<p-message
							[severity]="form().get('isActive')?.value ? 'success' : 'warn'"
							[text]="form().get('isActive')?.value ? 'Active' : 'Inactive'"
							class="py-1 px-2 text-sm"
						/>
					</div>
				</div>
			</div>

			<div class="pt-6">
				<p-button
					type="submit"
					[label]="isEdit() ? 'Update Store' : 'Create Store'"
					class="w-full"
					[disabled]="disabled()"
				/>
			</div>
		</form>
	`,
})
export class StoreFormComponent {
	form = input.required<FormGroup>();
	isEdit = input<boolean>(false);
	disabled = input<boolean>(false);
	submitForm = output<void>();
}

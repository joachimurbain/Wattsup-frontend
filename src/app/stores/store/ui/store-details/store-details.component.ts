import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../data-access/store.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { toSignal } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { StoreFormComponent } from './ui/store-form.component';

@Component({
	selector: 'app-store-details',
	imports: [DialogModule, ProgressSpinnerModule, StoreFormComponent, CardModule],
	template: `
		<h1 class="text-xl font-bold  p-4 mb-4">Store Information</h1>

		<app-store-form [form]="form" [isEdit]="isEdit()" [disabled]="isLoading()" (submitForm)="onSubmit()" />

		<p-dialog
			[visible]="isLoading()"
			[modal]="true"
			[closable]="false"
			[dismissableMask]="false"
			[style]="{ width: '300px' }"
			[contentStyle]="{ 'text-align': 'center' }"
		>
			<p-progressSpinner strokeWidth="4" styleClass="block mx-auto" />
			<p class="mt-4 font-medium">Saving store...</p>
		</p-dialog>
	`,
	styles: ``,
})
export default class StoreDetailsComponent {
	private storeService = inject(StoreService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private fb = inject(FormBuilder);

	isLoading = signal(false);

	parentParams = toSignal(this.route.parent!.paramMap);
	storeId = computed(() => this.parentParams()?.get('storeId'));
	isEdit = computed(() => this.storeId() !== 'new');

	store = computed(() => this.storeService.fullItems()[Number(this.storeId())]);

	form: FormGroup = this.fb.group({
		name: [null, Validators.required],
		address: [null, Validators.required],
		city: [null, Validators.required],
		zipcode: [null, [Validators.required, Validators.min(1000)]],
		storeCode: [null, Validators.required],
		surfaceArea: [null, [Validators.required, Validators.min(1)]],
		isActive: [true],
	});

	constructor() {
		effect(() => {
			const data = this.store();

			debugger;
			if (data) {
				this.form.patchValue(data);
			}
		});
	}

	onSubmit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.isLoading.set(true);

		const payload = {
			...(this.store() ?? {}),
			...this.form.value,
		};

		if (this.isEdit()) {
			this.storeService.update$.next(payload);
		} else {
			this.storeService.create$.next(payload);
		}

		setTimeout(() => {
			this.isLoading.set(false);
			this.router.navigate(['/stores']);
		}, 2000);
	}
}

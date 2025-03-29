import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

import { MeterService } from '../../../../meters/data-access/meter.service';
import { MeterFormComponent } from '../../../../meters/meter/ui/meter-form.component';
import { StoreService } from '../../../data-access/store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
	standalone: true,
	selector: 'app-store-meter-create',
	imports: [CommonModule, CardModule, MeterFormComponent, BreadcrumbModule],
	template: `
		<h1 class="text-xl font-bold  p-4 mb-4">Create Meter</h1>
		<app-meter-form [form]="form" (submitForm)="onSubmit()" />
	`,
})
export default class StoreMeterCreateComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private fb = inject(FormBuilder);
	private meterService = inject(MeterService);
	private storeService = inject(StoreService);

	parentParams = toSignal(this.route.parent!.paramMap);
	storeId = computed(() => Number(this.parentParams()?.get('storeId')));

	form: FormGroup = this.fb.group({
		type: [null, Validators.required],
	});

	store = computed(() => this.storeService.fullItems()[this.storeId()]);

	onSubmit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.meterService.create$.next({
			...this.form.value,
			storeId: this.storeId(),
		});

		this.router.navigate(['/stores', this.storeId(), 'meters']);
	}
}

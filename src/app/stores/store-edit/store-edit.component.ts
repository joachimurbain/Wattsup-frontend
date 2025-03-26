import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { StoreService } from '../data-access/store.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreFormComponent } from './ui/store-form/store-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import MetersOfStoreComponent from '../../meters/meters-of-store.component';

@Component({
	selector: 'app-store-edit',
	imports: [ReactiveFormsModule, StoreFormComponent, Dialog, ProgressSpinnerModule, MetersOfStoreComponent],
	template: `
		<div class="p-6 max-w-xl mx-auto">
			<h2 class="text-xl font-semibold mb-4">
				{{ isEdit() ? 'Edit Store' : 'Create Store' }}
			</h2>

			<app-store-form
				[form]="form"
				[isEdit]="isEdit()"
				[disabled]="isLoading()"
				(submitForm)="onSubmit()"
			></app-store-form>

			@if (isEdit()) {
			<app-meters-of-store [storeId]="store()!.id" />
			}

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
		</div>
	`,
	styles: ``,
})
export default class StoreEditComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private storeService = inject(StoreService);
	private fb = inject(FormBuilder);

	isLoading = signal(false);
	idParam = this.route.snapshot.paramMap.get('id');

	isEdit = computed(() => this.idParam !== 'new');
	store = computed(() => {
		const id = Number(this.idParam);
		return this.isEdit() ? this.storeService.fullItems()[id] : null;
	});

	form: FormGroup = this.fb.group({
		name: [null, Validators.required],
		address: [null, Validators.required],
		surface: [null, [Validators.required, Validators.min(1)]],
	});

	constructor() {
		effect(() => {
			const data = this.store();
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

		const updateItem = {
			...(this.store() ?? {}),
			...this.form.value,
		};

		if (this.isEdit()) {
			this.storeService.update$.next(updateItem);
		} else {
			this.storeService.create$.next(updateItem);
		}

		// Simulate loading and navigate
		setTimeout(() => {
			this.isLoading.set(false);
			this.router.navigate(['/admin/stores']);
		}, 3000);
	}
}

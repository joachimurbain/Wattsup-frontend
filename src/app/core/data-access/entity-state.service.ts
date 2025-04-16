import { computed, effect, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { CrudApiService } from './crud-api.service';
import { BaseEntity } from './base-entity.model';

export interface EntityState<T extends BaseEntity, TLight extends BaseEntity & Partial<T> = BaseEntity & Partial<T>> {
	summaries: TLight[];
	fullItems: Record<number, T>;
}

export abstract class EntityStateService<
	T extends BaseEntity,
	TLight extends BaseEntity & Partial<T> = BaseEntity & Partial<T>
> {
	// ────────────────────────────────
	//  Dependencies
	// ────────────────────────────────
	private readonly _apiService: CrudApiService<T>;

	// ────────────────────────────────
	//  Core Reactive State
	// ────────────────────────────────
	protected readonly state = signal<EntityState<T>>({
		summaries: [],
		fullItems: {},
	});

	// ────────────────────────────────
	//  Triggers (write-only)
	// ────────────────────────────────
	private readonly _loadAll = signal(false);
	private readonly _loadOne = signal<number | null>(null);

	private readonly _createItem = signal<Omit<T, 'id'> | null>(null);
	private readonly _created = signal<T | null>(null);
	private readonly _updateItem = signal<Partial<T> | null>(null);
	private readonly _updated = signal<T | null>(null);
	private readonly _deleteItem = signal<number | null>(null);
	private readonly _deleted = signal<number | null>(null);

	// ────────────────────────────────
	//  Public Reactive Indicators
	// ────────────────────────────────
	public readonly isLoading = signal(false);
	public readonly error = signal<string | null>(null);

	// ────────────────────────────────
	//  Public Read Accessors
	// ────────────────────────────────
	public readonly summaries = computed(() => this.state().summaries);
	public readonly fullItems = computed(() => this.state().fullItems);
	public readonly fullItemById = (idSignal: Signal<number | string | null | undefined>) =>
		computed(() => {
			const id = idSignal();
			if (id == null) {
				return undefined;
			}
			return this.fullItems()[+id];
		});

	public readonly created = this._created.asReadonly();
	public readonly updated = this._updated.asReadonly();
	public readonly deleted = this._deleted.asReadonly();
	// ────────────────────────────────
	//  Constructor & Effects
	// ────────────────────────────────
	constructor(protected httpClient: HttpClient, protected resourceEndPoint: string) {
		this._apiService = new CrudApiService<T>(httpClient, resourceEndPoint);

		// Effect: Fetch all
		effect(() => {
			if (!this._loadAll()) return;

			this.isLoading.set(true);
			this.error.set(null);

			this._apiService
				.getAll()
				.pipe(finalize(() => this.isLoading.set(false)))
				.subscribe({
					next: (items) => {
						this.state.update((state) => ({
							...state,
							summaries: items,
						}));
					},
					error: (err) => {
						this.error.set(err?.message ?? 'Unknown error');
					},
				});

			this._loadAll.set(false); // reset trigger
		});

		// Effect: Load one item by ID
		effect(() => {
			const id = this._loadOne();
			if (id === null || this.state().fullItems[id]) {
				return;
			}

			this.isLoading.set(true);
			this.error.set(null);

			this._apiService
				.getById(id)
				.pipe(finalize(() => this.isLoading.set(false)))
				.subscribe({
					next: (item) => {
						this.state.update((state) => ({
							...state,
							fullItems: {
								...state.fullItems,
								[item.id]: item,
							},
						}));
					},
					error: (err) => {
						this.error.set(err?.message ?? 'Error loading item');
					},
				});

			this._loadOne.set(null); // reset
		});

		// Effect: Create
		effect(() => {
			const dto = this._createItem();
			if (!dto) return;

			this.isLoading.set(true);
			this.error.set(null);

			this._apiService
				.create(dto)
				.pipe(finalize(() => this.isLoading.set(false)))
				.subscribe({
					next: (createdItem) => {
						this.state.update((state) => ({
							...state,
							fullItems: {
								...state.fullItems,
								[createdItem.id]: createdItem,
							},
							summaries: state.summaries.map((s) => (s.id === createdItem.id ? this.mapToSummary(createdItem) : s)),
						}));
						this._created.set(createdItem);
					},
					error: (err) => {
						this.error.set(err?.message ?? 'Error creating item');
					},
				});

			this._createItem.set(null); // reset
		});

		effect(() => {
			if (this.created()) {
				queueMicrotask(() => this._created.set(null)); // reset for next trigger
			}
		});

		// Effect: Update
		effect(() => {
			const dto = this._updateItem();
			if (!dto || dto.id == null) return;

			this.isLoading.set(true);
			this.error.set(null);

			this._apiService
				.update(dto)
				.pipe(finalize(() => this.isLoading.set(false)))
				.subscribe({
					next: (updatedItem) => {
						this.state.update((state) => ({
							...state,
							fullItems: {
								...state.fullItems,
								[updatedItem.id]: updatedItem,
							},
							summaries: state.summaries.map((s) => (s.id === updatedItem.id ? this.mapToSummary(updatedItem) : s)),
						}));

						this._updated.set(updatedItem);
					},
					error: (err) => {
						this.error.set(err?.message ?? 'Error updating item');
					},
				});

			this._updateItem.set(null); // reset
		});

		effect(() => {
			if (this.updated()) {
				queueMicrotask(() => this._updated.set(null)); // reset for next trigger
			}
		});

		// Effect: Delete
		effect(() => {
			const id = this._deleteItem();
			if (id == null) return;

			this.isLoading.set(true);
			this.error.set(null);

			this._apiService
				.delete(id)
				.pipe(finalize(() => this.isLoading.set(false)))
				.subscribe({
					next: () => {
						this.state.update((state) => {
							const { [id]: removed, ...restFullItems } = state.fullItems;
							const summaries = state.summaries.filter((item) => item.id !== id);

							return {
								...state,
								fullItems: restFullItems,
								summaries,
							};
						});

						this._deleted.set(id);
					},
					error: (err) => {
						this.error.set(err?.message ?? 'Error deleting item');
					},
				});

			this._deleteItem.set(null); // reset
		});

		effect(() => {
			if (this.deleted()) {
				queueMicrotask(() => this._deleted.set(null)); // reset for next trigger
			}
		});

		// Effect: Error reporting
		effect(() => {
			const message = this.error();
			if (message) {
				console.error(`[EntityStateService] Error: ${message}`);
			}
		});
	}

	// ────────────────────────────────
	//  Public Methods
	// ────────────────────────────────
	public create(dto: Omit<T, 'id'>) {
		this._createItem.set(dto);
	}

	public update(dto: Partial<T>) {
		this._updateItem.set(dto);
	}

	public loadAll() {
		this._loadAll.set(true);
	}

	public loadOne(id: number) {
		this._loadOne.set(id);
	}

	public delete(id: number) {
		this._deleteItem.set(id);
	}

	// ────────────────────────────────
	//  Overridable Hook
	// ────────────────────────────────

	protected mapToSummary(item: T): TLight {
		return item as unknown as TLight;
	}
}

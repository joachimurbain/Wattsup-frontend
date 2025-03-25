import { Inject, Injectable, computed, inject, signal } from '@angular/core';
import { BaseEntity } from '../Interfaces/base-entity';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, BehaviorSubject, switchMap, map, EMPTY } from 'rxjs';
import { CrudApiService } from './crud-api.service';

interface EntityState<T extends BaseEntity> {
	items: T[];
	currentItem: T | null;
	error: string | null;
}

export abstract class EntityStateService<T extends BaseEntity> {
	private _apiService: CrudApiService<T>;

	// state
	private state = signal<EntityState<T>>({
		items: [],
		currentItem: null,
		error: null,
	});

	//selectors
	items = computed(() => this.state().items);
	currentItem = computed(() => this.state().currentItem);
	error = computed(() => this.state().error);

	//sources
	private error$ = new Subject<string | null>();
	getAll$ = new Subject<void>();
	getOne$ = new BehaviorSubject<number | null>(null);
	create$ = new Subject<Omit<T, 'id'>>();
	update$ = new Subject<Partial<T>>();
	delete$ = new Subject<number>();

	constructor(
		protected httpClient: HttpClient,
		protected resourceEndPoint: string
	) {
		this._apiService = new CrudApiService<T>(httpClient, resourceEndPoint);

		this.error$.pipe(takeUntilDestroyed()).subscribe((error) =>
			this.state.update((state) => ({
				...state,
				error,
			}))
		);

		this.getAll$
			.pipe(
				takeUntilDestroyed(),
				switchMap(() => this._apiService.getAll())
			)
			.subscribe({
				next: (items) =>
					this.state.update((state) => ({
						...state,
						items: items,
						error: null,
					})),
				error: (err) => this.error$.next(err),
			});

		this.getOne$
			.pipe(
				switchMap((id) => (id ? this._apiService.getById(id) : EMPTY))
			)
			.subscribe({
				next: (item) =>
					this.state.update((state) => ({
						...state,
						currentItem: item,
						error: null,
					})),
				error: (err) => this.error$.next(err),
			});

		this.create$
			.pipe(
				takeUntilDestroyed(),
				switchMap((item) => this._apiService.create(item))
			)
			.subscribe({
				next: (newITem) =>
					this.state.update((state) => ({
						...state,
						items: [...state.items, newITem],
						error: null,
					})),
				error: (err) => this.error$.next(err),
			});

		// Handle edit$ events
		this.update$
			.pipe(
				takeUntilDestroyed(),
				switchMap((item) => this._apiService.update(item))
			)
			.subscribe({
				next: (updatedItem) =>
					this.state.update((state) => ({
						...state,
						items: state.items.map((p) =>
							p.id === updatedItem.id ? updatedItem : p
						),
						error: null,
					})),
				error: (err) => this.error$.next(err),
			});

		this.delete$
			.pipe(
				takeUntilDestroyed(),
				switchMap((id) =>
					this._apiService.delete(id).pipe(map(() => id))
				)
			)
			.subscribe({
				next: (removedId) =>
					this.state.update((state) => ({
						...state,
						items: state.items.filter((i) => i.id !== removedId),
						error: null,
					})),
				error: (err) => this.error$.next(err),
			});
	}
}

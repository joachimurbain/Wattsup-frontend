import { computed, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, BehaviorSubject, switchMap, map, EMPTY } from 'rxjs';
import { CrudApiService } from './crud-api.service';
import { BaseEntity } from './base-entity.model';

interface EntityState<T extends BaseEntity,TLight=BaseEntity&Partial<T>> {
	summaries: TLight[];
	fullItems: Record<number, T>;
	error: string | null;
}

export abstract class EntityStateService<T extends BaseEntity> {
	private _apiService: CrudApiService<T>;

	// state
	protected state = signal<EntityState<T>>({
		summaries: [],
		fullItems: {},
		error: null,
	});

	//selectors
	summaries = computed(() => this.state().summaries);
	fullItems = computed(() => this.state().fullItems);
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
						summaries: items,
						error: null,
					})),
				error: (err) => this.error$.next(err),
			});

		this.getOne$
			.pipe(
				switchMap((id) => {
					if(!id){
						return EMPTY;
					}
					const cached = this.state().fullItems[id];
					if(cached){
						return EMPTY;
					}
					return this._apiService.getById(id)
				})
			)
			.subscribe({
				next: (item) =>
					this.state.update((state) => ({
						...state,
						fullItems: {
							...state.fullItems,
							[item.id]: item,
						},
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
				next: (newItem) =>
					this.state.update((state) => ({
						...state,
						summaries: [...state.summaries, newItem],
						fullItems: {
							...state.fullItems,
							[newItem.id]: newItem,
						},
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
						summaries: state.summaries.map((p) =>
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
						summaries: state.summaries.filter((i) => i.id !== removedId),
						error: null,
					})),
				error: (err) => this.error$.next(err),
			});
	}
}

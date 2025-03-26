import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, EMPTY, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Credentials } from './credentials.model';


export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';
export type AuthUser = { id: number; email: string; Role: string } | null;

interface AuthState {
	user: AuthUser;
	status: LoginStatus;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private apiUrl = environment.apiUrl;
	private _httpClient = inject(HttpClient);

	// Sources
	login$ = new Subject<Credentials>();
	error$ = new Subject<string | null>();
	token$ = new BehaviorSubject<string | null>(
		localStorage.getItem('authToken')
	);

	// State
	private state = signal<AuthState>({
		user: null,
		status: 'pending',
	});

	// Selectors
	status = computed(() => this.state().status);
	user = computed(() => this.state().user);

	userAuthenticated$ = this.login$.pipe(
		switchMap((credentials: Credentials) =>
			this.login(credentials).pipe(
				tap((response) => this.token$.next(response.token)),
				catchError((err) => {
					this.error$.next(err.error?.message || 'Login failed');
					return EMPTY;
				})
			)
		)
	);

	constructor() {
		// When login$ emits, update status to 'authenticating'.
		this.login$.pipe(takeUntilDestroyed()).subscribe(() =>
			this.state.update((state) => ({
				...state,
				status: 'authenticating',
			}))
		);

		// When userAuthenticated$ emits, update the state with the user and set status to 'success'.
		this.userAuthenticated$
			.pipe(takeUntilDestroyed())
			.subscribe(() =>
				this.state.update((state) => ({ ...state, status: 'success' }))
			);

		// When error$ emits, update the state status to 'error'.
		this.error$
			.pipe(takeUntilDestroyed())
			.subscribe(() =>
				this.state.update((state) => ({ ...state, status: 'error' }))
			);

		// When token$ emits, store the token in localStorage and fetch user info.
		this.token$
			.pipe(
				takeUntilDestroyed(),
				switchMap((token) => {
					if (token) {
						localStorage.setItem('authToken', token);
						return this.me();
					} else {
						localStorage.removeItem('authToken');
						return of(null);
					}
				})
			)
			.subscribe((user: AuthUser) => {
				this.state.update((state) => ({
					...state,
					user,
					status: user ? 'success' : 'pending',
				}));
			});
	}

	login(credentials: Credentials): Observable<{ token: string }> {
		return this._httpClient.post<{ token: string }>(
			`${this.apiUrl}User/login`,
			credentials
		);
	}

	me(): Observable<AuthUser> {
		return this._httpClient.get<AuthUser>(`${this.apiUrl}User/me`).pipe(
			catchError((err) => {
				this.error$.next(err.error?.message || 'Failed to fetch user');
				return EMPTY;
			})
		);
	}

	logout() {
		this.token$.next(null);
	}
}

import { computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseEntity } from './base-entity.model';

export class CrudApiService<T extends BaseEntity> {
	protected readonly apiUrl: string;

	constructor(private _httpClient: HttpClient, api_endpoint: string) {
		this.apiUrl = environment.apiUrl + api_endpoint;
		console.log(this.apiUrl);
	}

	public getAll(): Observable<T[]> {
		return this._httpClient.get<T[]>(this.apiUrl).pipe();
	}

	public getById(id: number) {
		return this._httpClient.get<T>(`${this.apiUrl}/${id}`).pipe();
	}

	public create(dto: Omit<T, 'id'>) {
		return this._httpClient.post<T>(this.apiUrl, dto).pipe();
	}

	public update(dto: Partial<T>) {
		return this._httpClient.put<T>(`${this.apiUrl}/${dto.id}`, dto).pipe();
	}

	public delete(id: number) {
		return this._httpClient.delete<void>(`${this.apiUrl}/${id}`).pipe();
	}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityStateService } from '../../core/data-access/entity-state.service';
import { Store } from './store.model';
import { environment } from '../../../environments/environment';
import { Meter } from '../../meters/data-access/meter.model';

@Injectable({
	providedIn: 'root',
})
export class StoreService extends EntityStateService<Store> {
	constructor(httpClient: HttpClient) {
		super(httpClient, 'Store');
	}
}

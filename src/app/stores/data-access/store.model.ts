import { BaseEntity } from '../../core/data-access/base-entity.model';
import { Meter } from '../../meters/data-access/meter.model';

export interface Store {
	id: number;
	name: string;
	address: string;
	city: string;
	zipcode: number;
	storeCode: string;
	surfaceArea: number;
	isActive: boolean;
	meters: Meter[] | null;
	// manager:User;
}

export type StoreLight = BaseEntity & Partial<Store>;

// export type AddProductItem = Omit<ProductItem, 'id'>;
// export type EditProductItem = ProductItem;

// export type RemoveProductItem = ProductItem['id'];

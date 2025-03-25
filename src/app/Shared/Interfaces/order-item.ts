import { ProductItem } from './product-item';

export interface OrderItem {
	id: number;

	status: OrderStatus;
	created: Date;
	quantity: number;

	product: ProductItem;
	// userId: number;
}

export enum OrderStatus {
	Pending,
	Done,
	Cancelled,
}

export type AddOrderItem = Omit<OrderItem, 'id' | 'created' | 'status'>;
// export type EditProductItem = ProductItem;

// export type RemoveProductItem = ProductItem['id'];

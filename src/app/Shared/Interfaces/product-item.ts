export interface ProductItem {
	id: number;
	name: string;
	description: string;
	priceExclTax: number;
	stockQuantity: number;
	category: string;
}

export type AddProductItem = Omit<ProductItem, 'id'>;
export type EditProductItem = ProductItem;

export type RemoveProductItem = ProductItem['id'];

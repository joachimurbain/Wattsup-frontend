import { BaseEntity } from '../../core/data-access/base-entity.model';

export interface Meter extends BaseEntity {
	uuid: string;
	type: MeterType;
	deactivationDate: Date | null;
	QrCode: string;
	storeId: Number;
}

export type MeterLight = BaseEntity & Partial<Meter>;

export enum MeterType {
	electricity,
	gas,
	water,
}

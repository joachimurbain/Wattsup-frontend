import { BaseEntity } from '../../core/data-access/base-entity.model';

export interface Meter extends BaseEntity {
	uuid: string;
	type: MeterType;
	deactivationDate: Date | null;
	lastReading: Date;
	QrCode: string;
	storeId: Number;
}

export type MeterLight = BaseEntity & Partial<Meter>;

export enum MeterType {
	Electricity = 'Electricity',
	Gas = 'Gas',
	Water = 'Water',
}

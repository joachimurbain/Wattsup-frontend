import { BaseEntity } from '../../core/data-access/base-entity.model';

export interface MeterReading extends BaseEntity {
	value: number;
	readingDate: Date;
	source: MeterReadingSource;
	meterId: number;
}

export type MeterLight = BaseEntity & Partial<MeterReadingSource>;

export enum MeterReadingSource {
	Manual = 'Manual',
	QRCode = 'QRCode',
}

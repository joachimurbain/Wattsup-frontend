import { BaseEntity } from '../../core/data-access/base-entity.model';

export interface MeterReading extends BaseEntity {
	value: number | null;
	readingDate: Date;
	source: MeterReadingSource;
	meterId: number;
}

export type CreateMeterReading = Omit<MeterReading, 'id'>;

export type MeterLight = BaseEntity & Partial<MeterReading>;

export enum MeterReadingSource {
	Manual = 'Manual',
	QRCode = 'QRCode',
}

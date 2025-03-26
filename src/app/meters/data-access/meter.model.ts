import { BaseEntity } from "../../core/data-access/base-entity.model";

export type MeterType = 'electricity' | 'gas' | 'water';

export interface Meter extends BaseEntity {
  uuid: string;
  type: MeterType;
  deactivationDate: Date | null;
	QrCode:string;
	storeId:Number;
}
import type { IBaseService } from "./base";

import { and, eq, type SQL } from "drizzle-orm";
import {
  DeviceSelectSchema,
  DeviceUpdateSchema,
  DeviceInsertSchema,
} from "../models";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { DevicesTable } from "../domain/models";
import type { Static } from "@sinclair/typebox";

export type DeviceSelect = Static<typeof DeviceSelectSchema>;
export type DeviceInsert = Static<typeof DeviceInsertSchema>;
export type DeviceUpdate = Static<typeof DeviceUpdateSchema>;

export interface IDeviceService
  extends IBaseService<number, DeviceSelect, DeviceInsert, DeviceUpdate> {}

export class DeviceService implements IDeviceService {
  constructor(private readonly db: BunSQLiteDatabase) {}

  async getAll(): Promise<DeviceSelect[]> {
    return await this.db.select().from(DevicesTable);
  }

  async getAllByFilters(filters: SQL[]): Promise<DeviceSelect[]> {
    return await this.db
      .select()
      .from(DevicesTable)
      .where(and(...filters));
  }

  async getOneByFilters(filters: SQL<unknown>[]): Promise<DeviceSelect | null> {
    const devices = await this.db
      .select()
      .from(DevicesTable)
      .where(and(...filters))
      .limit(1);
    if (!devices || devices.length === 0) {
      return null;
    }
    return devices[0];
  }

  async getOneById(id: number): Promise<DeviceSelect | null> {
    const device = await this.db
      .select()
      .from(DevicesTable)
      .where(eq(DevicesTable.id, id));
    if (!device || device.length === 0) {
      return null;
    }
    return device[0];
  }

  async create(device: DeviceInsert): Promise<DeviceSelect | null> {
    const newDevice = await this.db
      .insert(DevicesTable)
      .values(device)
      .returning();
    if (!newDevice || newDevice.length === 0) {
      return null;
    }
    return newDevice[0];
  }

  async update(id: number, device: DeviceUpdate): Promise<DeviceSelect | null> {
    const updatedDevice = await this.db
      .update(DevicesTable)
      .set(device)
      .where(eq(DevicesTable.id, id))
      .returning();
    if (!updatedDevice || updatedDevice.length === 0) {
      return null;
    }
    return updatedDevice[0];
  }

  async delete(id: number): Promise<void> {
    return await this.db.delete(DevicesTable).where(eq(DevicesTable.id, id));
  }
}

import type { IBaseService } from "./base";

import { and, eq, type SQL } from "drizzle-orm";
import {
  RecordSelectSchema,
  RecordUpdateSchema,
  RecordInsertSchema,
} from "../models";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { RecordsTable } from "../domain/models";
import type { Static } from "@sinclair/typebox";

export type RecordSelect = Static<typeof RecordSelectSchema>;
export type RecordInsert = Static<typeof RecordInsertSchema>;
export type RecordUpdate = Static<typeof RecordUpdateSchema>;

export interface IRecordService
  extends IBaseService<number, RecordSelect, RecordInsert, RecordUpdate> {}

export class RecordService implements IRecordService {
  constructor(private readonly db: BunSQLiteDatabase) {}

  async getAll(): Promise<RecordSelect[]> {
    return await this.db.select().from(RecordsTable);
  }

  async getAllByFilters(filters: SQL[]): Promise<RecordSelect[]> {
    return await this.db
      .select()
      .from(RecordsTable)
      .where(and(...filters));
  }

  async getOneByFilters(filters: SQL<unknown>[]): Promise<RecordSelect | null> {
    const devices = await this.db
      .select()
      .from(RecordsTable)
      .where(and(...filters))
      .limit(1);
    if (!devices || devices.length === 0) {
      return null;
    }
    return devices[0];
  }

  async getOneById(id: number): Promise<RecordSelect | null> {
    const device = await this.db
      .select()
      .from(RecordsTable)
      .where(eq(RecordsTable.id, id));
    if (!device || device.length === 0) {
      return null;
    }
    return device[0];
  }

  async create(device: RecordInsert): Promise<RecordSelect | null> {
    const newRecord = await this.db
      .insert(RecordsTable)
      .values(device)
      .returning();
    if (!newRecord || newRecord.length === 0) {
      return null;
    }
    return newRecord[0];
  }

  async update(id: number, device: RecordUpdate): Promise<RecordSelect | null> {
    const updatedRecord = await this.db
      .update(RecordsTable)
      .set(device)
      .where(eq(RecordsTable.id, id))
      .returning();
    if (!updatedRecord || updatedRecord.length === 0) {
      return null;
    }
    return updatedRecord[0];
  }

  async delete(id: number): Promise<void> {
    return await this.db.delete(RecordsTable).where(eq(RecordsTable.id, id));
  }
}

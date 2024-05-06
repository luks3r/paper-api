import { Table, type SQL } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export interface IBaseService<
  KeyType,
  SelectType,
  InsertType,
  UpdateType = InsertType
> {
  getAll(): Promise<SelectType[]>;
  getOneById(id: KeyType): Promise<SelectType | null>;
  getAllByFilters(filters: SQL[]): Promise<SelectType[]>;
  getOneByFilters(filters: SQL[]): Promise<SelectType | null>;
  create(device: InsertType): Promise<SelectType | null>;
  update(id: KeyType, device: UpdateType): Promise<SelectType | null>;
  delete(id: KeyType): Promise<void>;
}

export class BaseService<
  Model extends Table,
  KeyType,
  SelectType extends { id: KeyType },
  InsertType extends object = SelectType,
  UpdateType extends object = InsertType
> implements IBaseService<KeyType, SelectType, InsertType, UpdateType>
{
  constructor(
    protected readonly db: BunSQLiteDatabase,
    protected readonly table: Model
  ) {}

  async getAll(): Promise<SelectType[]> {
    const result = await this.db.select().from(this.table);
    return result as SelectType[];
  }
  getOneById(id: KeyType): Promise<SelectType | null> {
    throw new Error("Method not implemented.");
  }
  getAllByFilters(filters: SQL<unknown>[]): Promise<SelectType[]> {
    throw new Error("Method not implemented.");
  }
  getOneByFilters(filters: SQL<unknown>[]): Promise<SelectType | null> {
    throw new Error("Method not implemented.");
  }
  create(device: InsertType): Promise<SelectType | null> {
    throw new Error("Method not implemented.");
  }
  update(id: KeyType, device: UpdateType): Promise<SelectType | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: KeyType): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

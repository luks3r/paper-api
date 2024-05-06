import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const DevicesTable = sqliteTable("devices", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  minCapacity: integer("min_capacity").notNull().default(0),
  maxCapacity: integer("max_capacity").notNull().default(100),
});

export const RecordsTable = sqliteTable("records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: integer("device_id")
    .notNull()
    .references(() => DevicesTable.id),
  batteryLevel: real("battery_level").notNull(),
  fillLevel: real("fill_level").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$default(
    () => new Date()
  ),
});

import { Elysia, t } from "elysia";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { DevicesTable } from "../domain/models";

export const DeviceSelectSchema = createSelectSchema(DevicesTable);
export const DeviceInsertSchema = createInsertSchema(DevicesTable);
export const DeviceUpdateSchema = t.Partial(t.Omit(DeviceInsertSchema, ["id"]));

export const DeviceFilterSchema = t.Partial(
  t.Object({
    limit: t.Optional(t.Number({ minimum: 1 })),
    offset: t.Optional(t.Number()),
  })
);

export const devicesModel = new Elysia().model({
  "devices.getOne": DeviceSelectSchema,
  "devices.getAll": t.Array(DeviceSelectSchema),
  "devices.create": DeviceInsertSchema,
  "devices.update": DeviceUpdateSchema,
  "devices.filter": DeviceFilterSchema,
});

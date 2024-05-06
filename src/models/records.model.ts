import { Elysia, t } from "elysia";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { RecordsTable } from "../domain/models";

export const RecordSelectSchema = createSelectSchema(RecordsTable);
const insertSchema = createInsertSchema(RecordsTable);
export const RecordInsertSchema = t.Omit(insertSchema, ["id"]);
export const RecordUpdateSchema = t.Partial(RecordInsertSchema);

export const RecordFilterSchema = t.Partial(
  t.Object({
    limit: t.Optional(t.Number({ minimum: 1 })),
    offset: t.Optional(t.Number()),
  })
);

export const recordsModel = new Elysia().model({
  "records.getOne": RecordSelectSchema,
  "records.getAll": t.Array(RecordSelectSchema),
  "records.create": RecordInsertSchema,
  "records.update": RecordUpdateSchema,
  "records.filter": RecordFilterSchema,
});

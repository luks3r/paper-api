import { Elysia, NotFoundError, ValidationError, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { RecordInsertSchema, devicesModel, recordsModel } from "./models";
import { DeviceService, RecordService, type RecordInsert } from "./services";

import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { Value } from "@sinclair/typebox/value";
import { cors } from "@elysiajs/cors";
import { createClient } from "libsql-stateless-easy";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!process.env.TURSO_TOKEN) {
  throw new Error("TURSO_TOKEN is not set");
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_TOKEN,
});
const db = drizzle(client, {
  logger: true,
});
migrate(db, { migrationsFolder: "./drizzle" });

const devices = new Elysia({
  prefix: "/devices",
  detail: {
    tags: ["Devices"],
  },
})
  .decorate({
    DeviceService: new DeviceService(db),
  })
  .use(devicesModel)
  .get("/", async ({ DeviceService }) => await DeviceService.getAll(), {
    query: "devices.filter",
    response: { 200: "devices.getAll" },
  })
  .get(
    "/:id",
    async ({ set, DeviceService, params }) => {
      let result = await DeviceService.getOneById(params.id);
      if (!result) {
        set.status = 404;
        throw new NotFoundError("Device not found");
      }
      return result;
    },
    {
      params: t.Object({ id: t.Numeric() }),
      response: { 200: "devices.getOne" },
    }
  )
  .post(
    "/",
    async ({ set, DeviceService, body }) => {
      const result = await DeviceService.create(body);
      if (!result) {
        set.status = 400;
        throw new Error("Failed to create device");
      }
      set.status = 201;
      return result;
    },
    {
      body: "devices.create",
      response: { 201: "devices.getOne" },
    }
  )
  .delete(
    "/:id",
    async ({ DeviceService, params }) => await DeviceService.delete(params.id),
    {
      params: t.Object({ id: t.Numeric() }),
    }
  )
  .put(
    "/:id",
    async ({ DeviceService, params, body }) => {
      const result = await DeviceService.update(params.id, body);
      if (!result) {
        throw new Error("Failed to update device");
      }
      return result;
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: "devices.update",
      response: { 200: "devices.getOne" },
    }
  );

const records = new Elysia({
  prefix: "/records",
  detail: {
    tags: ["Records"],
  },
})
  .decorate({
    RecordService: new RecordService(db),
  })
  .use(recordsModel)
  .get("/", async ({ RecordService }) => await RecordService.getAll(), {
    query: "records.filter",
    response: { 200: "records.getAll" },
  })
  .get(
    "/:id",
    async ({ set, RecordService, params }) => {
      let result = await RecordService.getOneById(params.id);
      if (!result) {
        set.status = 404;
        throw new NotFoundError("Record not found");
      }
      return result;
    },
    {
      params: t.Object({ id: t.Numeric() }),
      response: { 200: "records.getOne" },
    }
  )
  .post(
    "/",
    async ({ set, RecordService, body }) => {
      const result = await RecordService.create(body);
      if (!result) {
        set.status = 400;
        throw new Error("Failed to create record");
      }
      set.status = 201;
      return result;
    },
    {
      body: "records.create",
      response: { 201: "records.getOne" },
    }
  )
  .post(
    "/csv",
    async ({ set, RecordService, body }) => {
      const params = body.split(",");
      if (params.length !== 4) {
        throw new Error("Invalid CSV format");
      }
      const paramsObject = Value.Convert(RecordInsertSchema, {
        deviceId: Number(params[0]),
        createdAt: Number(params[1]),
        fillLevel: params[2],
        batteryLevel: params[3],
      });
      if (!paramsObject) {
        throw new ValidationError(
          "RecordInsertSchema",
          RecordInsertSchema,
          paramsObject
        );
      }
      const result = await RecordService.create(paramsObject as RecordInsert);
      if (!result) {
        set.status = 400;
        throw new Error("Failed to create record");
      }
      set.status = 201;
      return result;
    },
    {
      body: t.String(),
      response: { 201: "records.getOne" },
    }
  )
  .delete(
    "/:id",
    async ({ RecordService, params }) => await RecordService.delete(params.id),
    {
      params: t.Object({ id: t.Numeric() }),
    }
  )
  .put(
    "/:id",
    async ({ set, RecordService, params, body }) => {
      const result = await RecordService.update(params.id, body);
      if (!result) {
        set.status = 400;
        throw new Error("Failed to update record");
      }
      set.status = 200;
      return result;
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: "records.update",
      response: { 200: "records.getOne" },
    }
  );

export const app = new Elysia()
  .use(
    cors({
      origin: /.*/,
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "Paper++ API Documentation",
          version: "1.0.0",
        },
        tags: [
          {
            name: "Devices",
            description: "Device management",
          },
          {
            name: "Records",
            description: "Record management",
          },
        ],
      },
    })
  )
  .group("/api/v1", (api) => api.use(devices).use(records))
  .listen(3030);

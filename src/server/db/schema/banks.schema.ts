import { ACCT_TYPES } from "@/lib/constants";
import {
  pgEnum,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const acctTypeEnum = pgEnum("acct_type_enum", ACCT_TYPES);

export const banks = pgTable(
  "banks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: acctTypeEnum("type").default("Savings").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
  },
  (banks) => [uniqueIndex("banks_unique_idx").on(banks.type, banks.name)],
);

// db schemas
export const banksSchema = createSelectSchema(banks);
export const banksInsertSchema = createInsertSchema(banks);
export const banksUpdateSchema = createUpdateSchema(banks);

//form schemas
export const banksCreateSchema = banksInsertSchema.omit({ id: true });
export const bankIdSchema = banksSchema.pick({ id: true });
export const acctTypeSchema = banksSchema.pick({ type: true });

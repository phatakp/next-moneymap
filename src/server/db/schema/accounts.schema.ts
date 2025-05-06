import { INV_TYPES } from "@/lib/constants";
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { z } from "zod";
import { banks, banksSchema } from "./banks.schema";
import { users } from "./users.schema";

export const invTypeEnum = pgEnum("inv_type_enum", INV_TYPES);

export const bankAccounts = pgTable(
  "bank_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    num: text("num").notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    balance: real("balance").notNull(),
    value: real("value").notNull(),
    asOfDate: date("as_of_date", { mode: "string" }).defaultNow(),
    invType: invTypeEnum("inv_type"),
    bankId: uuid("bank_id")
      .references(() => banks.id)
      .notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    isDefault: boolean("is_default").default(false),
    isAsset: boolean("is_asset").default(false),
    isLiquid: boolean("is_liquid").default(false),
  },
  (accounts) => [check("bal_check", sql`${accounts.balance} >= 0`)],
);

export const mfAccounts = pgTable("mf_accounts", {
  id: uuid("id")
    .primaryKey()
    .references(() => bankAccounts.id),
  nav: real("nav").notNull(),
  units: real("units").notNull(),
  isSip: boolean("is_sip").default(false),
  sipAmount: integer("sip_amount"),
});

export const equityAccounts = pgTable("equity_accounts", {
  id: uuid("id")
    .primaryKey()
    .references(() => bankAccounts.id),
  currPrice: real("curr_price").notNull(),
  buyPrice: real("buy_price").notNull(),
  quantity: integer("quantity").notNull(),
  prefix: varchar("prefix", { length: 200 }),
});

// db schemas
export const accountsSchema = createSelectSchema(bankAccounts);
export const accountsInsertSchema = createInsertSchema(bankAccounts);
export const accountsUpdateSchema = createUpdateSchema(bankAccounts);

export const mfAccountsSchema = createSelectSchema(mfAccounts);
export const mfAccountsInsertSchema = createInsertSchema(mfAccounts);
export const mfAccountsUpdateSchema = createUpdateSchema(mfAccounts);

export const equityAccountsSchema = createSelectSchema(equityAccounts);
export const equityAccountsInsertSchema = createInsertSchema(equityAccounts);
export const equityAccountsUpdateSchema = createUpdateSchema(equityAccounts);

// form schemas
export const acctIdSchema = accountsSchema.pick({ id: true });
export const invTypeSchema = accountsSchema.pick({ invType: true });
export const acctInsertFormSchema = accountsInsertSchema
  .extend({})
  .and(mfAccountsInsertSchema.extend({}))
  .and(equityAccountsInsertSchema.extend({}));

//types
export type AccountWithBank = z.infer<typeof accountsSchema> & {
  bank: z.infer<typeof banksSchema>;
};

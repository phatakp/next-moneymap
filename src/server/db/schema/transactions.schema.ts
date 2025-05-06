import { CATEGORIES } from "@/lib/constants";
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { bankAccounts } from "./accounts.schema";
import { groups } from "./groups.schema";

export const categoryEnum = pgEnum("category_enum", CATEGORIES);
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    description: varchar("description", { length: 256 }),
    amount: real("amount").notNull(),
    date: timestamp("date", { mode: "string" }).defaultNow(),
    category: categoryEnum("category"),
    acctId: uuid("acct_id")
      .references(() => bankAccounts.id)
      .notNull(),
    groupId: uuid("group_id")
      .references(() => groups.id)
      .notNull(),
    isIncome: boolean("is_income").default(false),
  },
  (transactions) => [
    check("amt_check", sql`${transactions.amount} > 0`),
    index("txn_date_index").on(transactions.date),
  ],
);

//db schemas
export const transactionsSchema = createSelectSchema(transactions);
export const transactionsInsertSchema = createInsertSchema(transactions);
export const transactionsUpdateSchema = createUpdateSchema(transactions);

// form schemas
export const transactionsIdSchema = transactionsSchema.pick({ id: true });
export const categorySchema = transactionsSchema.pick({ category: true });

import { CATEGORIES, GRP_TXN_TYPES } from "@/lib/constants";
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
import { z } from "zod";
import { bankAccounts, type AccountWithBank } from "./accounts.schema";
import { groups, groupsSchema } from "./groups.schema";

export const categoryEnum = pgEnum("category_enum", CATEGORIES);
export const grpTxnTypeEnum = pgEnum("group_txn_type_enum", GRP_TXN_TYPES);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    description: varchar("description", { length: 256 }),
    amount: real("amount").notNull(),
    date: timestamp("date", { mode: "date" }).defaultNow(),
    category: categoryEnum("category"),
    acctId: uuid("acct_id")
      .references(() => bankAccounts.id)
      .notNull(),
    groupId: uuid("group_id")
      .references(() => groups.id)
      .notNull(),
    grpTxnType: grpTxnTypeEnum("grp_txn_type"),
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
export const txnFormSchema = transactionsInsertSchema
  .extend({
    category: z.enum(CATEGORIES).optional(),
    grpTxnType: z.enum(GRP_TXN_TYPES).optional(),
    amount: z.coerce.number().positive({ message: "Amount is required" }),
  })
  .superRefine((data, ctx) => {
    if (!data.category && !data.description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category and/or Desc is required",
        path: ["category", "description"],
      });
    }
  });

//Types
export type CategoryType = z.infer<typeof transactionsSchema>["category"];
export type FullTransaction = z.infer<typeof transactionsSchema> & {
  account: AccountWithBank;
  group: z.infer<typeof groupsSchema>;
};

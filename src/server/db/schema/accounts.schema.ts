import { ACCT_TYPES, INV_TYPES } from "@/lib/constants";
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
import { z } from "zod";
import { acctTypeSchema, banks, banksSchema } from "./banks.schema";
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
export const acctNumSchema = accountsSchema.pick({ num: true });
export const acctIdSchema = accountsSchema.pick({ id: true });
export const invTypeSchema = accountsSchema.pick({ invType: true });
export const acctInsertFormSchema = accountsInsertSchema
  .omit({ userId: true })
  .extend({
    name: z.string({ required_error: "Name is required" }),
    num: z.string({ required_error: "Account Number is required" }),
    type: z.enum(ACCT_TYPES),
    balance: z.coerce.number().positive({ message: "Balance is required" }),
    value: z.coerce.number().positive({ message: "Value is required" }),
  })
  .and(
    mfAccountsInsertSchema.omit({ id: true }).extend({
      nav: z.coerce.number({ message: "NAV is required" }).optional(),
      units: z.coerce.number({ message: "Units is required" }).optional(),
      sipAmount: z.coerce
        .number({ message: "SIP Amount is required" })
        .optional(),
    }),
  )
  .and(
    equityAccountsInsertSchema.omit({ id: true }).extend({
      quantity: z.coerce.number({ message: "Quantity is required" }).optional(),
      currPrice: z.coerce
        .number({ message: "Curr Price is required" })
        .optional(),
      buyPrice: z.coerce
        .number({ message: "Buying Price is required" })
        .optional(),
    }),
  )
  .superRefine((data, ctx) => {
    if (!data.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current Value is required",
        path: ["value"],
      });
    }
    if (data.type === "Investment" && !data.invType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Investment type is required",
        path: ["invType"],
      });
    }
    if (data.type !== "Investment" && !!data.invType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Type should be investment",
        path: ["type"],
      });
    }

    //Mutual Fund
    if (
      data.invType !== "Mutual-Fund" &&
      (!!data.nav || !!data.units || data.isSip || !!data.sipAmount)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MF fields should not be populated",
        path: ["invType"],
      });
    }
    if (data.invType === "Mutual-Fund" && !data.nav) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NAV is required",
        path: ["nav"],
      });
    }
    if (data.invType === "Mutual-Fund" && !data.units) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Units is required",
        path: ["units"],
      });
    }
    if (data.invType === "Mutual-Fund" && !data.isSip && !!data.sipAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Should be SIP type",
        path: ["isSip"],
      });
    }
    if (data.invType === "Mutual-Fund" && data.isSip && !data.sipAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SIP Amount is required",
        path: ["sipAmount"],
      });
    }

    //Equity
    if (
      data.invType !== "Equity" &&
      (!!data.quantity || !!data.currPrice || data.buyPrice || !!data.prefix)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Equity fields should not be populated",
        path: ["invType"],
      });
    }
    if (data.invType === "Equity" && !data.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Quantity is required",
        path: ["quantity"],
      });
    }
    if (data.invType === "Equity" && !data.currPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current Price is required",
        path: ["currPrice"],
      });
    }
    if (data.invType === "Equity" && !data.buyPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Buying Price is required",
        path: ["buyPrice"],
      });
    }
    if (data.invType === "Equity" && !data.prefix) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Prefix is required",
        path: ["prefix"],
      });
    }
  });

//types
export type AcctType = z.infer<typeof acctTypeSchema>["type"];
export type AccountWithBank = z.infer<typeof accountsSchema> & {
  bank: z.infer<typeof banksSchema>;
  mf?: z.infer<typeof mfAccountsSchema>;
  equity?: z.infer<typeof equityAccountsSchema>;
};

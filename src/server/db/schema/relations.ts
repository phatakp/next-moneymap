import { relations } from "drizzle-orm";
import { bankAccounts, equityAccounts, mfAccounts } from "./accounts.schema";
import { banks } from "./banks.schema";
import { groups, groupUsers } from "./groups.schema";
import { transactions } from "./transactions.schema";
import { users } from "./users.schema";

//User Relations
export const userRelations = relations(users, ({ many }) => ({
  accounts: many(bankAccounts, { relationName: "userAccounts" }),
  groups: many(groupUsers, { relationName: "groupUsersList" }),
}));

//Bank Relations
export const bankRelations = relations(banks, ({ many }) => ({
  accounts: many(bankAccounts, { relationName: "bankAccounts" }),
}));

//Account Relations
export const accountRelations = relations(bankAccounts, ({ one, many }) => ({
  bank: one(banks, {
    fields: [bankAccounts.bankId],
    references: [banks.id],
    relationName: "bankAccounts",
  }),
  user: one(users, {
    fields: [bankAccounts.userId],
    references: [users.id],
    relationName: "userAccounts",
  }),
  transactions: many(transactions, { relationName: "acctTransactions" }),
}));

//MF Account Relations
export const mfAccountRelations = relations(mfAccounts, ({ one }) => ({
  account: one(bankAccounts, {
    fields: [mfAccounts.id],
    references: [bankAccounts.id],
    relationName: "mfAccountRelation",
  }),
}));

//EQUITY Account Relations
export const equityAccountRelations = relations(equityAccounts, ({ one }) => ({
  account: one(bankAccounts, {
    fields: [equityAccounts.id],
    references: [bankAccounts.id],
    relationName: "equityAccountRelation",
  }),
}));

//Group Relations
export const groupRelations = relations(groups, ({ many }) => ({
  groupUsers: many(groupUsers, { relationName: "groupUserList" }),
  transactions: many(transactions, { relationName: "groupTransactions" }),
}));

//Group User Relations
export const groupUsersRelations = relations(groupUsers, ({ one, many }) => ({
  group: one(groups, {
    fields: [groupUsers.groupId],
    references: [groups.id],
    relationName: "groupUserList",
  }),
  users: many(users, { relationName: "groupUsersList" }),
}));

//Transactions Relations
export const transactionRelations = relations(transactions, ({ one }) => ({
  account: one(bankAccounts, {
    fields: [transactions.acctId],
    references: [bankAccounts.id],
    relationName: "acctTransactions",
  }),
  group: one(groups, {
    fields: [transactions.groupId],
    references: [groups.id],
    relationName: "groupTransactions",
  }),
}));

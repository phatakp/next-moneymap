import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  bankAccounts,
  banks,
  groups,
  transactions,
  transactionsIdSchema,
  txnFormSchema,
  type FullTransaction,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";

export const txnRouter = createTRPCRouter({
  create: protectedProcedure
    .input(txnFormSchema)
    .mutation(async ({ ctx, input }) => {
      const acct = await ctx.db.query.bankAccounts.findFirst({
        where: (bankAccounts, { eq }) => eq(bankAccounts.id, input.acctId),
        with: { bank: true },
      });

      if (!acct)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find account",
        });

      return await ctx.db.transaction(async (tx) => {
        const [txn] = await tx.insert(transactions).values(input).returning();
        if (!txn)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not add transaction",
          });
        const amt = txn.isIncome
          ? acct.bank.type === "Credit-Card"
            ? txn.amount * -1
            : txn.amount
          : acct.bank.type === "Credit-Card"
            ? txn.amount
            : txn.amount * -1;
        await tx
          .update(bankAccounts)
          .set({
            balance: sql`${bankAccounts.balance} + ${amt}`,
            value: sql`${bankAccounts.value} + ${amt}`,
          })
          .where(eq(bankAccounts.id, txn?.acctId));

        return txn;
      });
    }),

  update: protectedProcedure
    .input(txnFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input?.id)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ID is required",
        });

      const { id, ...values } = input;
      const txn = await ctx.db.query.transactions.findFirst({
        where: (transactions, { eq }) => eq(transactions.id, id),
      });

      if (!txn?.id)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      const acct = await ctx.db.query.bankAccounts.findFirst({
        where: (bankAccounts, { eq }) => eq(bankAccounts.id, input.acctId),
        with: { bank: true },
      });

      if (!acct)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        });
      return await ctx.db.transaction(async (tx) => {
        const [trn] = await tx
          .update(transactions)
          .set(values)
          .where(eq(transactions.id, id))
          .returning();

        if (txn.acctId !== input.acctId) {
          const oldAmt = txn.isIncome
            ? acct.bank.type === "Credit-Card"
              ? txn.amount
              : txn.amount * -1
            : acct.bank.type === "Credit-Card"
              ? txn.amount * -1
              : txn.amount;
          const newAmt = input.isIncome
            ? acct.bank.type === "Credit-Card"
              ? input.amount * -1
              : input.amount
            : acct.bank.type === "Credit-Card"
              ? input.amount
              : input.amount * -1;
          await tx
            .update(bankAccounts)
            .set({
              balance: sql`${bankAccounts.balance} + ${oldAmt}`,
              value: sql`${bankAccounts.value} + ${oldAmt}`,
            })
            .where(eq(bankAccounts.id, txn?.acctId));
          await tx
            .update(bankAccounts)
            .set({
              balance: sql`${bankAccounts.balance} + ${newAmt}`,
              value: sql`${bankAccounts.value} + ${newAmt}`,
            })
            .where(eq(bankAccounts.id, input.acctId));
        } else if (txn.amount !== input.amount) {
          let amt = input.amount;
          amt = txn.isIncome
            ? acct.bank.type === "Credit-Card"
              ? Math.abs(txn.amount - input.amount) * -1
              : Math.abs(txn.amount - input.amount)
            : acct.bank.type === "Credit-Card"
              ? Math.abs(txn.amount - input.amount)
              : Math.abs(txn.amount - input.amount) * -1;
          await tx
            .update(bankAccounts)
            .set({
              balance: sql`${bankAccounts.balance} + ${amt}`,
              value: sql`${bankAccounts.value} + ${amt}`,
            })
            .where(eq(bankAccounts.id, txn?.acctId));
        }

        return trn;
      });
    }),

  getUserTxnById: protectedProcedure
    .input(transactionsIdSchema)
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(transactions)
        .innerJoin(bankAccounts, eq(bankAccounts.id, transactions.id))
        .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
        .innerJoin(groups, eq(groups.id, transactions.groupId))
        .where(eq(transactions.id, input.id));

      return {
        ...result?.transactions,
        account: { ...result?.bank_accounts, bank: result?.banks },
        group: result?.groups,
      } as FullTransaction;
    }),

  getAllUserTxns: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(transactions)
      .innerJoin(bankAccounts, eq(bankAccounts.id, transactions.id))
      .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
      .innerJoin(groups, eq(groups.id, transactions.groupId));

    return result
      .filter((r) => r.bank_accounts.userId === ctx.user.id)
      .map((r) => ({
        ...r.transactions,
        account: { ...r.bank_accounts, bank: r.banks },
        group: r.groups,
      })) as FullTransaction[];
  }),
});

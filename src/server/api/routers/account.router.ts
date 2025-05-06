import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  acctInsertFormSchema,
  acctTypeSchema,
  bankAccounts,
  banks,
  type AccountWithBank,
} from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const bankAccountRouter = createTRPCRouter({
  create: protectedProcedure
    .input(acctInsertFormSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        // await ctx.db.insert(bankAccounts).values({
        //   name: input.name,
        // });
      });
    }),

  getBalancesByType: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.db
      .select({
        type: banks.type,
        totValue: sql`sum(${bankAccounts.value})`.mapWith(Number),
      })
      .from(bankAccounts)
      .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
      .where(eq(bankAccounts.userId, ctx.user.id))
      .groupBy(banks.type);

    return stats;
  }),
  getBalancesByClass: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.db
      .select({
        isAsset: bankAccounts.isAsset,
        isLiquid: bankAccounts.isLiquid,
        totValue: sql`sum(${bankAccounts.value})`.mapWith(Number),
      })
      .from(bankAccounts)
      .where(eq(bankAccounts.userId, ctx.user.id))
      .groupBy(bankAccounts.isAsset, bankAccounts.isLiquid);

    return stats;
  }),

  getUserAccountsByType: protectedProcedure
    .input(acctTypeSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(bankAccounts)
        .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
        .where(
          and(eq(bankAccounts.userId, ctx.user.id), eq(banks.type, input.type)),
        );

      return result.map((r) => ({
        ...r.bank_accounts,
        bank: r.banks,
      })) as AccountWithBank[];
    }),
});

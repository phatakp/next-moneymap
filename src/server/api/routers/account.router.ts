import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  acctInsertFormSchema,
  acctNumSchema,
  acctTypeSchema,
  bankAccounts,
  banks,
  equityAccounts,
  equityAccountsInsertSchema,
  mfAccounts,
  mfAccountsInsertSchema,
  type AccountWithBank,
  type MFAPIData,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import parse from "node-html-parser";
import { z } from "zod";

export const bankAccountRouter = createTRPCRouter({
  create: protectedProcedure
    .input(acctInsertFormSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        nav,
        units,
        isSip,
        sipAmount,
        type,
        currPrice,
        buyPrice,
        quantity,
        prefix,
        ...mainAcctValues
      } = input;
      return await ctx.db.transaction(async (tx) => {
        if (input.isDefault) {
          await tx
            .update(bankAccounts)
            .set({ isDefault: false })
            .where(
              and(
                eq(bankAccounts.userId, ctx.user.id),
                eq(bankAccounts.isDefault, true),
              ),
            )
            .returning();
        }
        const [acct] = await tx
          .insert(bankAccounts)
          .values({
            ...mainAcctValues,
            userId: ctx.user.id,
            isLiquid: ["Savings", "Wallet"].includes(type),
            isAsset: !["Mortgage", "Credit-Card"].includes(type),
          })
          .returning();

        if (!acct)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not add account",
          });

        if (input.invType === "Mutual-Fund") {
          const mfData: z.infer<typeof mfAccountsInsertSchema> = {
            id: acct.id,
            nav: nav!,
            units: units!,
            isSip,
            sipAmount,
          };
          const [mfAcct] = await tx
            .insert(mfAccounts)
            .values(mfData)
            .returning();
          if (!mfAcct)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Could not add MF account",
            });
        }
        if (input.invType === "Equity") {
          const eqData: z.infer<typeof equityAccountsInsertSchema> = {
            id: acct.id,
            currPrice: currPrice!,
            buyPrice: buyPrice!,
            quantity: quantity!,
            prefix,
          };
          const [eqAcct] = await tx
            .insert(equityAccounts)
            .values(eqData)
            .returning();
          if (!eqAcct)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Could not add Equity account",
            });
        }
        return acct;
      });
    }),

  update: protectedProcedure
    .input(acctInsertFormSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        nav,
        units,
        isSip,
        sipAmount,
        type,
        currPrice,
        buyPrice,
        quantity,
        prefix,
        ...mainAcctValues
      } = input;

      if (!input?.id)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "ID is required",
        });

      return await ctx.db.transaction(async (tx) => {
        const [acc] = await tx
          .select()
          .from(bankAccounts)
          .where(
            and(
              eq(bankAccounts.id, input.id!),
              eq(bankAccounts.userId, ctx.user.id),
            ),
          );

        if (!acc)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found",
          });

        if (input.isDefault && !acc.isDefault) {
          await tx
            .update(bankAccounts)
            .set({ isDefault: false })
            .where(
              and(
                eq(bankAccounts.userId, ctx.user.id),
                eq(bankAccounts.isDefault, true),
              ),
            )
            .returning();
        }
        await tx
          .update(bankAccounts)
          .set({
            name: mainAcctValues.name,
            num: mainAcctValues.num,
            balance: mainAcctValues.balance,
            value: mainAcctValues.value,
            isDefault: mainAcctValues.isDefault,
            asOfDate: new Date().toISOString().split("T")[0],
          })
          .where(eq(bankAccounts.id, acc.id));

        if (input.invType === "Mutual-Fund") {
          await tx
            .update(mfAccounts)
            .set({ nav: nav!, units: units!, isSip, sipAmount })
            .where(eq(mfAccounts.id, acc.id));
        }
        if (input.invType === "Equity") {
          await tx
            .update(equityAccounts)
            .set({
              currPrice: currPrice!,
              buyPrice: buyPrice!,
              quantity: quantity!,
            })
            .where(eq(equityAccounts.id, acc.id));
        }
        return acc;
      });
    }),

  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await ctx.db
      .select({
        type: banks.type,
        name: banks.name,
        invType: bankAccounts.invType,
        isAsset: bankAccounts.isAsset,
        isLiquid: bankAccounts.isLiquid,
        totValue: sql`sum(${bankAccounts.value})`.mapWith(Number),
      })
      .from(bankAccounts)
      .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
      .where(eq(bankAccounts.userId, ctx.user.id))
      .groupBy(
        banks.type,
        banks.name,
        bankAccounts.invType,
        bankAccounts.isAsset,
        bankAccounts.isLiquid,
      );

    return stats;
  }),

  getUserAccountsByType: protectedProcedure
    .input(acctTypeSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(bankAccounts)
        .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
        .leftJoin(mfAccounts, eq(bankAccounts.id, mfAccounts.id))
        .leftJoin(equityAccounts, eq(bankAccounts.id, equityAccounts.id))
        .where(
          and(eq(bankAccounts.userId, ctx.user.id), eq(banks.type, input.type)),
        );

      return result.map((r) => ({
        ...r.bank_accounts,
        bank: r.banks,
        mf: r.mf_accounts,
        equity: r.equity_accounts,
      })) as AccountWithBank[];
    }),

  getAllUserAccounts: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(bankAccounts)
      .innerJoin(banks, eq(bankAccounts.bankId, banks.id))
      .where(eq(bankAccounts.userId, ctx.user.id));

    return result.map((r) => ({
      ...r.bank_accounts,
      bank: r.banks,
    })) as AccountWithBank[];
  }),

  getMFDetails: protectedProcedure
    .input(acctNumSchema)
    .query(async ({ ctx, input }) => {
      const resp = await fetch(`https://api.mfapi.in/mf/${input.num}/latest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        } as HeadersInit,
        next: { revalidate: 3600 }, // Revalidate every 60*60 seconds
      });
      const d = (await resp.json()) as MFAPIData;

      if (resp.ok && resp.status === 200)
        return {
          schemeCode: d.meta.scheme_code,
          schemeName: d.meta.scheme_name,
          nav: parseFloat(d.data[0].nav),
          asOfDate: d.data[0].date,
        };
      else
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not get Mutual Fund details",
        });
    }),

  getEquityDetails: protectedProcedure
    .input(z.object({ prefix: z.string(), symbol: z.string() }))
    .query(async ({ ctx, input }) => {
      const resp = await fetch(
        `https://www.moneycontrol.com/india/stockpricequote/${input.prefix}/${input.symbol}`,
        {
          method: "GET",
          next: { revalidate: 3600 }, // Revalidate every 60*60 seconds
        },
      );
      const html = await resp.text();
      const doc = parse(html);
      const price = doc.getElementById("nsespotval")?.attributes.value;
      const stockName = doc
        .getElementById("stockName")
        ?.querySelector("h1")?.innerHTML;

      if (resp.ok && resp.status === 200)
        return {
          stockName: stockName ?? "",
          price: parseFloat(price ?? "0"),
        };
      else
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not get Equity details",
        });
    }),
});

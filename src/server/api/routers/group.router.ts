import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { groupIdSchema, type GroupWithUsers } from "@/server/db/schema";

export const groupRouter = createTRPCRouter({
  // create: protectedProcedure
  //   .input(txnFormSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const acct = await api.bankAccounts.getAccountById({ id: input.acctId });

  //     await ctx.db.transaction(async (tx) => {
  //       const [txn] = await tx.insert(transactions).values(input).returning();
  //       if (!txn)
  //         throw new TRPCError({
  //           code: "BAD_REQUEST",
  //           message: "Could not add transaction",
  //         });
  //       const amt = txn.isIncome
  //         ? acct.bank.type === "Credit-Card"
  //           ? txn.amount * -1
  //           : txn.amount
  //         : acct.bank.type === "Credit-Card"
  //           ? txn.amount
  //           : txn.amount * -1;
  //       await tx
  //         .update(bankAccounts)
  //         .set({
  //           balance: sql`${bankAccounts.balance} + ${amt}`,
  //           value: sql`${bankAccounts.value} + ${amt}`,
  //         })
  //         .where(eq(bankAccounts.id, txn?.acctId));
  //     });
  //   }),

  // update: protectedProcedure
  //   .input(txnFormSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     if (!input?.id)
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "ID is required",
  //       });

  //     const { id, ...values } = input;
  //     const txn = await api.transactions.getUserTxnById({ id });
  //     if (!txn?.id)
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Transaction not found",
  //       });
  //     const acct = await api.bankAccounts.getAccountById({ id: input.acctId });

  //     await ctx.db.transaction(async (tx) => {
  //       await tx
  //         .update(transactions)
  //         .set(values)
  //         .where(eq(transactions.id, id!));

  //       if (txn.acctId !== input.acctId) {
  //         const oldAmt = txn.isIncome
  //           ? txn.account.bank.type === "Credit-Card"
  //             ? txn.amount
  //             : txn.amount * -1
  //           : txn.account.bank.type === "Credit-Card"
  //             ? txn.amount * -1
  //             : txn.amount;
  //         const newAmt = input.isIncome
  //           ? acct.bank.type === "Credit-Card"
  //             ? input.amount * -1
  //             : input.amount
  //           : acct.bank.type === "Credit-Card"
  //             ? input.amount
  //             : input.amount * -1;
  //         await tx
  //           .update(bankAccounts)
  //           .set({
  //             balance: sql`${bankAccounts.balance} + ${oldAmt}`,
  //             value: sql`${bankAccounts.value} + ${oldAmt}`,
  //           })
  //           .where(eq(bankAccounts.id, txn?.acctId));
  //         await tx
  //           .update(bankAccounts)
  //           .set({
  //             balance: sql`${bankAccounts.balance} + ${newAmt}`,
  //             value: sql`${bankAccounts.value} + ${newAmt}`,
  //           })
  //           .where(eq(bankAccounts.id, input.acctId));
  //       } else if (txn.amount !== input.amount) {
  //         let amt = input.amount;
  //         amt = txn.isIncome
  //           ? acct.bank.type === "Credit-Card"
  //             ? Math.abs(txn.amount - input.amount) * -1
  //             : Math.abs(txn.amount - input.amount)
  //           : acct.bank.type === "Credit-Card"
  //             ? Math.abs(txn.amount - input.amount)
  //             : Math.abs(txn.amount - input.amount) * -1;
  //         await tx
  //           .update(bankAccounts)
  //           .set({
  //             balance: sql`${bankAccounts.balance} + ${amt}`,
  //             value: sql`${bankAccounts.value} + ${amt}`,
  //           })
  //           .where(eq(bankAccounts.id, txn?.acctId));
  //       }
  //     });
  //   }),

  getUserGroupById: protectedProcedure
    .input(groupIdSchema)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.groups.findFirst({
        where: (groups, { eq }) => eq(groups.id, input.id),
        with: {
          groupUsers: {
            with: { users: true },
            where: (groupUsers, { eq }) => eq(groupUsers.userId, ctx.user.id),
          },
        },
      });

      return result as GroupWithUsers;
    }),

  getAllUserGroups: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.groups.findMany({
      with: {
        groupUsers: {
          with: { users: true },
          where: (groupUsers, { eq }) => eq(groupUsers.userId, ctx.user.id),
        },
      },
    });
    return result as GroupWithUsers[];
  }),

  getUserPersonalGroup: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.groups.findFirst({
      where: (groups, { eq }) => eq(groups.name, "Personal"),
      with: {
        groupUsers: {
          with: { users: true },
          where: (groupUsers, { eq }) => eq(groupUsers.userId, ctx.user.id),
        },
      },
    });
    return result as GroupWithUsers;
  }),
});

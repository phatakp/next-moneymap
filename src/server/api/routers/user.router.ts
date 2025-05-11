import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  bankAccounts,
  groups,
  groupUsers,
  users,
  usersInsertSchema,
  usersUpdateFormSchema,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import type { z } from "zod";

export const userRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const cashAcct = await ctx.db.query.banks.findFirst({
      where: (banks, { eq }) => eq(banks.name, "Cash"),
    });
    if (!cashAcct)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cash Account Bank not found",
      });

    const user = await ctx.db.transaction(async (tx) => {
      // Create User Profile
      const user: z.infer<typeof usersInsertSchema> = {
        id: ctx.user.id,
        email: ctx.user.primaryEmailAddress?.emailAddress ?? "",
        firstName: ctx.user.firstName ?? "",
        lastName: ctx.user.lastName,
        image: ctx.user.imageUrl,
      };
      await tx.insert(users).values(user);

      // Create Cash Account
      await tx.insert(bankAccounts).values({
        name: "Cash Account",
        num: "XXXX-0000",
        balance: 0,
        value: 0,
        bankId: cashAcct.id,
        userId: ctx.user.id,
        isAsset: true,
        isLiquid: true,
      });

      //Create Personal Group
      const [grp] = await tx
        .insert(groups)
        .values({
          name: "Personal",
        })
        .returning();

      if (!grp?.id)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create Personal Group",
        });

      await tx
        .insert(groupUsers)
        .values({ groupId: grp.id, userId: ctx.user.id });

      return user;
    });

    return user;
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.user.id),
    });
    return user;
  }),

  update: protectedProcedure
    .input(usersUpdateFormSchema)
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .update(users)
        .set({ firstName: input.firstName, lastName: input.lastName })
        .where(eq(users.id, input.id))
        .returning();
      return user;
    }),
});

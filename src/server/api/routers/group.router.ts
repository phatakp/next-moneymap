import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  groupFormSchema,
  groupIdSchema,
  groups,
  groupsSchema,
  groupUsers,
  type GroupWithUsers,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import type { z } from "zod";

export const groupRouter = createTRPCRouter({
  create: protectedProcedure
    .input(groupFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const [grp] = await tx
          .insert(groups)
          .values({ name: input.name })
          .returning();
        if (!grp)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not add group",
          });
        const data = input.users.map((u) => ({ groupId: grp.id, userId: u }));
        await tx.insert(groupUsers).values(data);
        return grp;
      });
    }),

  update: protectedProcedure
    .input(groupFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input?.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group Id is required",
        });

      const { id, name } = input;
      const grp = await ctx.db.query.groups.findFirst({
        where: (groups, { eq }) => eq(groups.id, id),
        with: { groupUsers: true },
      });
      if (!grp)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group Not found",
        });
      await ctx.db.transaction(async (tx) => {
        if (input.name !== grp.name)
          await tx.update(groups).set({ name }).where(eq(groups.id, id));
        await tx.delete(groupUsers).where(eq(groupUsers.groupId, id));
        const data = input.users.map((u) => ({ groupId: grp.id, userId: u }));
        await tx.insert(groupUsers).values(data);
      });

      return grp;
    }),

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
    const result = await ctx.db
      .select({ group: groups })
      .from(groups)
      .innerJoin(groupUsers, eq(groupUsers.groupId, groups.id))
      .where(eq(groupUsers.userId, ctx.user.id));

    return result.map((r) => ({ ...r.group })) as z.infer<
      typeof groupsSchema
    >[];
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

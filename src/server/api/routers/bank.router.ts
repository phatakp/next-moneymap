import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { banks } from "@/server/db/schema";

export const bankRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(banks).values({
        name: input.name,
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const banks = await ctx.db.query.banks.findMany({
      orderBy: (banks, { asc }) => [asc(banks.type), asc(banks.name)],
    });

    return banks;
  }),
});

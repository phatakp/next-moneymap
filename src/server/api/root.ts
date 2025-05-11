import { bankAccountRouter } from "@/server/api/routers/account.router";
import { bankRouter } from "@/server/api/routers/bank.router";
import { groupRouter } from "@/server/api/routers/group.router";
import { txnRouter } from "@/server/api/routers/txn.router";
import { userRouter } from "@/server/api/routers/user.router";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  banks: bankRouter,
  transactions: txnRouter,
  bankAccounts: bankAccountRouter,
  groups: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

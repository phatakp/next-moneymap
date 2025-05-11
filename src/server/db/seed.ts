import { type NeonQueryFunction, neon } from "@neondatabase/serverless";
import "dotenv/config";
import {
  drizzle as NeonDrizzle,
  type NeonHttpDatabase,
} from "drizzle-orm/neon-http";

import { env } from "@/env";
import type { z } from "zod";
import acctsData from "./data/accounts.json";
import banksData from "./data/banks.json";
import * as schema from "./schema";
import {
  type InvType,
  bankAccounts,
  mfAccounts,
  type mfAccountsInsertSchema,
} from "./schema/accounts.schema";
import { type acctTypeSchema, banks } from "./schema/banks.schema";

let db: NeonHttpDatabase<typeof schema>;

async function loadBanks() {
  const data = banksData.map((d) => ({
    name: d.name,
    type: d.type as z.infer<typeof acctTypeSchema>["type"],
  }));
  await db.insert(banks).values(data).onConflictDoNothing();
  console.log("Banks data loaded");
}

async function loadAccounts() {
  const userId = await db.query.users
    .findFirst({
      where: (users, { eq }) => eq(users.email, "praveenphatak@gmail.com"),
    })
    .then((res) => res?.id);
  const banks = await db.query.banks.findMany();
  acctsData.forEach(async (d) => {
    const bank = banks.find(
      (bank) => d.type === bank.type && d.bank === bank.name,
    );
    if (!bank) throw new Error(`Could not find bank for ${d.type}-${d.bank}`);

    const data = {
      num: d.num,
      name: d.name,
      bankId: bank.id,
      userId: userId!,
      balance: d.balance,
      value: d.value,
      invType: d?.invType as InvType,
      isAsset: !["Credit-Card", "Mortgage"].includes(d.type),
      isLiquid: ["Savings", "Wallet"].includes(d.type),
    };

    try {
      const [acct] = await db.insert(bankAccounts).values(data).returning();
      console.log({ acct });
      if (!!acct?.id && acct.invType === "Mutual-Fund") {
        const mfData: z.infer<typeof mfAccountsInsertSchema> = {
          id: acct?.id,
          units: d.units!,
          isSip: !!d.isSip,
          nav: 0,
          sipAmount: 0,
        };
        await db.insert(mfAccounts).values(mfData);
      }
    } catch (error) {
      console.log(error);
    }
  });

  console.log("Accounts data loaded");
}

const seedDb = async () => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const start = Date.now();

  const sql: NeonQueryFunction<boolean, boolean> = neon(env.DATABASE_URL);
  db = NeonDrizzle(sql, { schema });

  console.log("⏳ Seeding DB...");
  await loadBanks();
  await loadAccounts();

  const end = Date.now();

  console.log("✅ Seed completed in", end - start, "ms");

  process.exit(0);
};

seedDb().catch((err) => {
  console.error("❌ Seed failed");
  console.error(err);
  process.exit(1);
});

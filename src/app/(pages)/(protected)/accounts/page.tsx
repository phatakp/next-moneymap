import { api } from "@/trpc/server";

export default async function AccountsPage() {
  const [typeStats, classStats] = await Promise.all([
    api.bankAccounts.getBalancesByType(),
    api.bankAccounts.getBalancesByClass(),
  ]);
  const liquid = classStats.find((s) => s.isAsset && s.isLiquid)?.totValue ?? 0;
  const liabilities = classStats.find((s) => !s.isAsset)?.totValue ?? 0;
  const inv_retirals =
    classStats.find((s) => s.isAsset && !s.isLiquid)?.totValue ?? 0;

  return (
    <div>
      AccountsPage
      <pre>{JSON.stringify(typeStats, null, 2)}</pre>
      <pre>{JSON.stringify(classStats, null, 2)}</pre>
    </div>
  );
}

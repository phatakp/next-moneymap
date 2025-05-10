import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACCT_TYPES } from "@/lib/constants";
import { api } from "@/trpc/server";
import { HandCoinsIcon, LandmarkIcon, PiggyBankIcon } from "lucide-react";
import StatCard from "./_components/stat-card";
import StatLink from "./_components/stat-link";

export default async function AccountsPage() {
  const stats = await api.bankAccounts.getUserStats();
  const liquid = stats
    .filter((s) => s.isAsset && s.isLiquid)
    .reduce((acc, b) => acc + b.totValue, 0);
  const assets = stats
    .filter((s) => s.isAsset)
    .reduce((acc, b) => acc + b.totValue, 0);
  const liabilities = stats
    .filter((s) => !s.isAsset)
    .reduce((acc, b) => acc + b.totValue, 0);
  const inv_retirals = stats
    .filter((s) => s.isAsset && !s.isLiquid)
    .reduce((acc, b) => acc + b.totValue, 0);
  const inv = stats
    .filter((s) => s.type === "Investment")
    .reduce((acc, b) => acc + b.totValue, 0);
  const retirals = stats
    .filter((s) => s.type === "Retirals")
    .reduce((acc, b) => acc + b.totValue, 0);
  const mf = stats
    .filter((s) => s.invType === "Mutual-Fund")
    .reduce((acc, b) => acc + b.totValue, 0);
  const equity = stats
    .filter((s) => s.invType === "Equity")
    .reduce((acc, b) => acc + b.totValue, 0);
  const deposit = stats
    .filter((s) => s.invType === "Deposit")
    .reduce((acc, b) => acc + b.totValue, 0);
  const nps = stats
    .filter((s) => s.name === "NPS")
    .reduce((acc, b) => acc + b.totValue, 0);
  const epf = stats
    .filter((s) => s.name === "EPF")
    .reduce((acc, b) => acc + b.totValue, 0);
  return (
    <div className="grid w-full gap-4 lg:grid-cols-4">
      <div className="flex flex-col gap-4 lg:col-span-3">
        <div className="grid w-full items-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Liquid" value={liquid} icon={HandCoinsIcon} />
          <StatCard
            title="Liabilities"
            value={liabilities}
            icon={LandmarkIcon}
          />
          <StatCard
            title="Investment/Retirals"
            value={inv_retirals}
            icon={PiggyBankIcon}
          />
          <StatCard empty />
          {/* <AcctModal id={`add-acct-new`}>
            <Button className="w-full">
              <PlusCircle /> New <span>Account</span>
            </Button>
          </AcctModal> */}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {ACCT_TYPES.filter(
                (t) => !["Retirals", "Investment"].includes(t),
              ).map((t) => {
                const value = stats
                  .filter((s) => s.type === t)
                  .reduce((acc, b) => acc + b.totValue, 0);
                const percent =
                  ["Savings", "Wallet"].includes(t) && assets > 0
                    ? value / assets
                    : liabilities > 0
                      ? value / liabilities
                      : 0;
                return (
                  <StatLink
                    href={`/accounts/${t}`}
                    key={t}
                    title={t}
                    value={value}
                    percent={percent}
                  />
                );
              })}

              <StatLink
                href={`/accounts/Investment`}
                title={"Mutual-Fund"}
                value={mf}
                percent={inv > 0 ? mf / inv : 0}
              />
              <StatLink
                href={`/accounts/Investment`}
                title={"Equity"}
                value={equity}
                percent={inv > 0 ? equity / inv : 0}
              />
              <StatLink
                href={`/accounts/Investment`}
                title={"Deposit"}
                value={deposit}
                percent={inv > 0 ? deposit / inv : 0}
              />
              <StatLink
                href={`/accounts/Retirals`}
                title={"NPS"}
                value={nps}
                percent={retirals > 0 ? nps / retirals : 0}
              />
              <StatLink
                href={`/accounts/Retirals`}
                title={"EPF"}
                value={epf}
                percent={retirals > 0 ? epf / retirals : 0}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4"></div>
    </div>
  );
}

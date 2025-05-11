import {
  AmountField,
  Currency,
  RupeeIcon,
  Value,
} from "@/components/shared/amount-field";
import BankLogo from "@/components/shared/bank-logo";
import Icon from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { masked_acct } from "@/lib/utils";
import type { AcctType } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { ArrowDownLeft, ArrowUpRight, PlusCircle } from "lucide-react";
import TxnModal from "../../transactions/_components/txn-modal";
import AcctModal from "../_components/acct-modal";

export default async function AccountsTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const accounts = await api.bankAccounts.getUserAccountsByType({
    type: type as AcctType,
  });
  const total = accounts.reduce((acc, b) => acc + b.value, 0);

  return (
    <div className="grid w-full gap-4 md:grid-cols-4">
      <div className="flex max-w-screen flex-col gap-4 md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Total {type}</CardTitle>
            <CardAction>
              <Icon name={type} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <AmountField>
              <Currency />
              <Value showfull className="text-4xl">
                {total}
              </Value>
            </AmountField>
            <div className="my-4 flex items-center justify-between gap-4">
              <AcctModal id={`add-acct-new`} type={type as AcctType}>
                <Button>
                  <PlusCircle />
                  <span className="hidden sm:flex">New Account</span>
                </Button>
              </AcctModal>
              <div className="flex items-center gap-4">
                <TxnModal id={`add-txn-new`}>
                  <Button variant={"destructive"}>
                    <span className="hidden sm:flex">Expense</span>{" "}
                    <ArrowUpRight />
                  </Button>
                </TxnModal>
                <TxnModal id={`add-txn-new`} isIncome>
                  <Button variant={"success"}>
                    <span className="hidden sm:flex">Receive</span>{" "}
                    <ArrowDownLeft />
                  </Button>
                </TxnModal>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your {type} accounts</CardTitle>
            <CardDescription>
              You have {accounts.length} accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex w-full flex-col gap-4">
              {accounts.map((acct) => (
                <AcctModal
                  key={acct.id}
                  id={`edit-acct-${acct.id}`}
                  type={type as AcctType}
                  acct={acct}
                >
                  <div className="group hover:motion-preset-rebound-up hover:bg-primary hover:text-primary-foreground grid cursor-pointer grid-cols-6 items-center px-4 py-2 md:grid-cols-12">
                    <BankLogo
                      src={`/bank-logos/${acct.bank.name.toLowerCase()}.png`}
                    />
                    <div className="col-span-4 flex w-full items-center gap-4 truncate overflow-clip md:col-span-10">
                      <div className="flex flex-col items-start pr-4">
                        <span className="truncate overflow-ellipsis md:text-lg md:text-clip">
                          {acct.name}
                        </span>
                        <span className="text-muted-foreground group-hover:text-muted text-sm">
                          {masked_acct(acct.num)}
                        </span>
                      </div>
                    </div>
                    <AmountField className="justify-end">
                      <RupeeIcon />
                      <Value className="text-right text-xl">{acct.value}</Value>
                    </AmountField>
                  </div>
                </AcctModal>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <TxnModal id={`add-txn-new`}>
              <Button>
                <span className="hidden sm:flex">Expense</span> <ArrowUpRight />
              </Button>
            </TxnModal>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

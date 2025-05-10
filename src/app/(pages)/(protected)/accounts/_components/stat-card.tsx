import { AmountField, Currency, Value } from "@/components/shared/amount-field";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon, type LucideIcon } from "lucide-react";
import AcctModal from "./acct-modal";

type Props =
  | {
      title: string;
      value: number;
      icon: LucideIcon;
      empty?: false;
    }
  | { empty: true; title?: string; value?: number; icon?: LucideIcon };

export default function StatCard({ title, value, icon: Icon, empty }: Props) {
  if (empty)
    return (
      <AcctModal id={`add-acct-new`}>
        <Card className="w-full p-0 sm:max-w-xs">
          <CardHeader className="bg-primary-gradient text-primary-foreground flex items-center justify-between rounded-t-lg py-2">
            <CardTitle>Add New Account</CardTitle>
            <CardAction className="bg-background flex size-8 items-center justify-center rounded-full">
              <PlusIcon className="text-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="h-[56px]"></CardContent>
        </Card>
      </AcctModal>
    );

  return (
    <Card className="w-full p-0 sm:max-w-xs">
      <CardHeader className="bg-primary-gradient text-primary-foreground flex items-center justify-between rounded-t-lg py-2">
        <CardTitle>{title}</CardTitle>
        <CardAction className="bg-background flex size-8 items-center justify-center rounded-full">
          <Icon className="text-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent className="py-0 pb-4">
        <AmountField>
          <Currency />
          <Value showfull className="text-2xl md:text-3xl">
            {value}
          </Value>
        </AmountField>
      </CardContent>
    </Card>
  );
}

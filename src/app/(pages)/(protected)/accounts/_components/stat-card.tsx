import { AmountField, Currency, Value } from "@/components/shared/amount-field";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number;
  icon: LucideIcon;
};

export default function StatCard({ title, value, icon: Icon }: Props) {
  return (
    <Card className="w-full p-0 sm:max-w-xs">
      <CardHeader className="bg-primary text-primary-foreground flex items-center justify-between rounded-t-lg py-2">
        <CardTitle>{title}</CardTitle>
        <CardAction className="bg-background flex size-8 items-center justify-center rounded-full">
          <Icon className="text-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent className="py-0 pb-4">
        <AmountField>
          <Currency />
          <Value>{value}</Value>
        </AmountField>
      </CardContent>
    </Card>
  );
}

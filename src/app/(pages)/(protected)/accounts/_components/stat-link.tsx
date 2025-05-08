import {
  AmountField,
  RupeeIcon,
  Value,
} from "@/components/shared/amount-field";
import Icon from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  href: string;
  value: number;
  percent: number;
};

export default function StatLink({ title, href, value, percent }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        // buttonVariants({ variant: "link" }),
        "group flex w-full items-center justify-between rounded-none border-b p-2 transition-all duration-500 ease-in-out",
      )}
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary flex size-6 items-center justify-center rounded-full">
          <Icon name={title} className="text-primary-foreground size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg">{title}</span>
          <span className="text-muted-foreground text-sm">
            {(percent * 100).toFixed(1)}% of allocation
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AmountField>
          <RupeeIcon />
          <Value className="text-xl">{value}</Value>
        </AmountField>
        <ChevronRight />
      </div>
    </Link>
  );
}

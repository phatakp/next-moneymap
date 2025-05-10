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
        "group hover:motion-bg-in-primary hover:shadow-primary md:shadow-input relative flex flex-row items-center justify-between rounded-none border-b py-2 transition-all duration-500 ease-in-out hover:shadow md:flex-col md:items-start md:gap-2 md:rounded-lg md:border-t md:px-2 md:shadow-md lg:px-4",
      )}
    >
      <div className="flex w-full items-center gap-2 md:flex-row-reverse md:justify-between">
        <div className="bg-primary-gradient flex size-6 items-center justify-center rounded-full">
          <Icon name={title} className="text-primary-foreground size-4" />
        </div>
        <div className="flex flex-col">
          <span className="md:title md:text-lg">{title}</span>
        </div>
      </div>
      <div className="flex items-center md:w-full md:justify-between md:gap-2">
        <AmountField>
          <RupeeIcon />
          <Value className="text-xl">{value}</Value>
        </AmountField>
        <ChevronRight />
      </div>
    </Link>
  );
}

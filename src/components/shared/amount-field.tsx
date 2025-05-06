import { amountFormatter, cn, shortAmount } from "@/lib/utils";
import { IndianRupeeIcon } from "lucide-react";

function Value({
  className,
  children,
  showfull = false,
  ...props
}: React.ComponentProps<"div"> & { children: number; showfull?: boolean }) {
  return (
    <div
      data-slot="value"
      className={cn("text-3xl font-bold", className)}
      {...props}
    >
      {showfull ? amountFormatter(children) : shortAmount(children)}
    </div>
  );
}

function RupeeIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IndianRupeeIcon
      data-slot="rupee-icon"
      className={cn("text-muted-foreground size-4", className)}
      {...props}
    />
  );
}

function Currency({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="currency"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      INR
    </span>
  );
}

function AmountField({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="amount-field"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { AmountField, Currency, RupeeIcon, Value };

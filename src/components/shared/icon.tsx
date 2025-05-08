import { cn } from "@/lib/utils";
import {
  BanknoteArrowUpIcon,
  ChartColumnIncreasingIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  ClipboardTypeIcon,
  CreditCardIcon,
  DiamondPercentIcon,
  HandCoinsIcon,
  LandmarkIcon,
  MountainIcon,
  PercentIcon,
  PiggyBankIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  logo: MountainIcon,
  dashboard: ChartPieIcon,
  accounts: LandmarkIcon,
  transactions: ClipboardTypeIcon,
  groups: UsersIcon,
  Savings: HandCoinsIcon,
  Investment: PiggyBankIcon,
  "Credit-Card": CreditCardIcon,
  Wallet: WalletIcon,
  Mortgage: LandmarkIcon,
  EPF: PercentIcon,
  NPS: DiamondPercentIcon,
  Retirals: DiamondPercentIcon,
  "Mutual-Fund": ChartColumnIncreasingIcon,
  Equity: ChartNoAxesCombinedIcon,
  Deposit: BanknoteArrowUpIcon,
};

export default function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const LIcon = icons[name]!;
  return <LIcon className={cn(className)} />;
}

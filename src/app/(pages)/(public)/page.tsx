import Background from "@/components/shared/background";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderGrid,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-between">
      <Background className="h-screen" type="grid">
        <PageHeader className="z-20 flex max-w-3xl flex-col items-center justify-center gap-8 py-8">
          <PageHeaderGrid>
            <Badge className="mx-auto px-4">
              MoneyMap <ArrowRight className="size-4" />
            </Badge>
            <PageHeaderHeading className="text-center text-balance">
              Finance at your fingertips
            </PageHeaderHeading>
            <PageHeaderDescription className="text-center text-balance">
              Graphically loaded. Track all your accounts. Know your worth.
            </PageHeaderDescription>
          </PageHeaderGrid>
          <PageActions>
            <Link
              prefetch={false}
              href={"/sign-in"}
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full",
              )}
            >
              Start Tracking
            </Link>
          </PageActions>
        </PageHeader>
      </Background>
    </section>
  );
}

import Link from "next/link";

import { SignUp } from "@clerk/nextjs";

import {
  PageActions,
  PageHeader,
  PageHeaderGrid,
  PageHeaderHeading,
} from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <main className="relative grid items-center justify-center">
      <PageHeader className="items-center">
        <PageHeaderGrid>
          <PageHeaderHeading />
          <PageActions className="md:justify-center">
            <Link
              href={"/"}
              className={cn(
                buttonVariants({ variant: "link" }),
                "font-karla underline",
              )}
            >
              Back to Home
            </Link>
          </PageActions>
        </PageHeaderGrid>
      </PageHeader>
      <SignUp appearance={{ variables: { fontFamily: "Karla" } }} />
    </main>
  );
}

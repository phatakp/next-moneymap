import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AcctType } from "@/server/db/schema";
import AcctForm from "../_components/acct-form";
import AcctFormProvider from "../_providers/acct-form-provider";

export default async function NewAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>;
}) {
  const { type } = await searchParams;
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <AcctFormProvider>
        <Card className="bg-background text-foreground w-full max-w-md shadow">
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
            <CardDescription>
              Enter details to save and track new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AcctForm type={type as AcctType} />
          </CardContent>
          <CardFooter className="flex w-full justify-end">
            <Button form="add-acct-form" type="submit">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </AcctFormProvider>
    </div>
  );
}

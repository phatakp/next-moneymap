import Background from "@/components/shared/background";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  return (
    <Background>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md space-y-6">
          <FileQuestion className="text-muted-foreground mx-auto h-24 w-24" />

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Page not found
            </h1>
            <p className="text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. The page
              might have been moved, deleted, or never existed.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/">Return home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
}

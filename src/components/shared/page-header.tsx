"use client";

import Balance from "react-wrap-balancer";

import { cn } from "@/lib/utils";

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex w-full flex-col justify-between gap-2 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function PageHeaderGrid({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid text-center", className)} {...props}>
      {children}
    </div>
  );
}

function PageHeaderHeading({
  title,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("title leading-tight font-extrabold", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Balance
      className={cn("text-foreground sm:text-lg", className)}
      {...props}
    />
  );
}

function PageActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center md:flex-row md:items-center md:gap-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderGrid,
  PageHeaderHeading,
};

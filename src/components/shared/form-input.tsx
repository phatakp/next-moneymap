"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Label } from "../ui/label";

export function FormInput<T>({
  label,
  className,
  description,
  name,
  type,
  placeholder,
  disabled,
  ...props
}: React.ComponentProps<"input"> & {
  name: keyof T;
  label: string;
  description?: string;
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const isError = !!errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "animate-in zoom-in-95 fade-in-0 slide-in-from-left-2 duration-500",
            type === "hidden" ? "w-0" : "w-full",
            className,
          )}
        >
          <FormControl>
            <div className="group relative z-0 w-full">
              <Input
                type={type}
                name={name}
                id={`${name}-id`}
                className={cn(
                  "peer h-12",
                  isError &&
                    "text-destructive focus-visible:border-input focus-visible:text-foreground focus-visible:ring-0",
                  !field.value && isError && "focus-visible:ring-destructive",
                  className,
                )}
                value={field.value}
                disabled={disabled}
                placeholder={placeholder}
                onFocus={(e) => e.target.select()}
                onChange={field.onChange}
                {...props}
              />
              <Label
                htmlFor={`${name}-id`}
                className={cn(
                  "bg-background text-foreground peer-placeholder-shown:bg-muted peer-placeholder-shown:text-muted-foreground peer-focus:bg-background peer-focus:text-foreground absolute top-4 left-3 z-10 origin-[0] -translate-y-5 scale-75 transform rounded-sm px-2 text-sm leading-none duration-300 peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:py-1 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  disabled && "text-muted-foreground opacity-70",
                  isError &&
                    "text-destructive peer-placeholder-shown:bg-destructive peer-placeholder-shown:text-destructive-foreground",
                  type === "hidden" && "hidden",
                )}
              >
                {label}
              </Label>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

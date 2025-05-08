"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

type SelectOption = {
  label: string;
  value: any;
};

export function FormSelect<T>({
  label,
  className,
  description,
  disabled,
  name,
  options,
  isLoading = false,
  handleChange,
}: React.ComponentProps<"select"> & {
  name: keyof T;
  label: string;
  options: SelectOption[];
  description?: string;
  isLoading?: boolean;
  handleChange?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const isError = !!errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex w-full flex-col", className)}>
          <div className="group relative z-0 w-full">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    isLoading={isLoading}
                    disabled={disabled}
                    className={cn(
                      "bg-input/30 h-12 w-full justify-between",
                      !field.value && "text-muted-foreground",
                      isError && "ring-destructive border-destructive",
                    )}
                  >
                    {field.value
                      ? options.find((opt) => opt.value === field.value)?.label
                      : `Select ${label}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={`Search ${label}...`} />
                  <CommandList>
                    <CommandEmpty>No {label} found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          value={opt.label}
                          key={opt.value}
                          onSelect={() => {
                            if (handleChange) handleChange();
                            setValue(name, opt.value);
                            clearErrors(name);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              opt.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {opt.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormLabel
              htmlFor={`${name}-id`}
              className={cn(
                "bg-background text-muted-foreground peer-placeholder-shown:bg-muted peer-placeholder-shown:text-muted-foreground peer-focus:bg-background peer-focus:text-foreground absolute top-4 left-3 z-10 origin-[0] -translate-y-6 scale-75 transform rounded-sm px-2 text-sm leading-none duration-300 peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:py-1 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                disabled && "text-muted-foreground opacity-70",
                isError &&
                  "text-destructive peer-placeholder-shown:bg-destructive peer-placeholder-shown:text-destructive-foreground",
              )}
            >
              {label}
            </FormLabel>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

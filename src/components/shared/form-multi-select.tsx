"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export type SelectOption = {
  label: string;
  value: any;
};

export function FormMultiSelect<T>({
  label,
  className,
  description,
  disabled,
  name,
  options,
  isLoading = false,
  handleChange,
  defaultValue,
}: React.ComponentProps<"select"> & {
  name: keyof T;
  label: string;
  options: SelectOption[];
  defaultValue: string[];
  description?: string;
  isLoading?: boolean;
  handleChange?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    control,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const isError = !!errors[name];
  const [selected, setSelected] = useState<SelectOption[]>(
    options.filter((opt) =>
      defaultValue?.some((val) => opt.value.includes(val)),
    ),
  );
  const selectables = options.filter(
    (o) => !selected.map((s) => s.value).includes(o.value),
  );

  const handleSetValue = (val: SelectOption) => {
    if (selected.map((s) => s.value).includes(val.value)) {
      selected.splice(selected.map((s) => s.value).indexOf(val.value), 1);
      setSelected(selected.filter((item) => item.value !== val.value));
    } else {
      setSelected((prevValue) => [...prevValue, val]);
    }
  };

  useEffect(() => {
    setValue(name, selected.map((s) => s.value) as any);
  }, [selected]);

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
                  {isLoading ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <div
                      role="combobox"
                      className={cn(
                        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs",
                        "bg-input/30 h-auto min-h-12 w-full justify-between",
                        !field.value && "text-muted-foreground",
                        isError && "ring-destructive border-destructive",
                        disabled && "pointer-events-none opacity-50",
                      )}
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : field.value ? (
                        <div className="flex-1 flex-wrap gap-2">
                          {selected.map((sel) => (
                            <Badge
                              key={sel.value}
                              className="relative pr-4 text-xs"
                            >
                              {sel.label}
                              <Button
                                type="button"
                                variant={"ghost"}
                                size={"icon"}
                                className="text-foreground absolute top-1/2 right-1 size-3 -translate-y-1/2"
                                onClick={() => handleSetValue(sel)}
                              >
                                <X className="text-primary-foreground size-2" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        `Select ${label}...`
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </div>
                  )}
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder={`Search ${label}...`} />
                  <CommandList>
                    <CommandEmpty>No {label} found.</CommandEmpty>
                    <CommandGroup>
                      {selectables.map((opt) => (
                        <CommandItem
                          value={opt.label}
                          key={opt.value}
                          onSelect={() => {
                            if (handleChange) handleChange();
                            handleSetValue(opt);
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

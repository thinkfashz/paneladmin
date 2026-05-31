"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import * as React from "react";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BaseComboboxProps {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

interface SingleComboboxProps extends BaseComboboxProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface MultiComboboxProps extends BaseComboboxProps {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

type ComboboxProps = SingleComboboxProps | MultiComboboxProps;

function Combobox({
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  disabled = false,
  className,
  triggerClassName,
  multiple,
  value,
  onValueChange,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedValues = React.useMemo(() => {
    if (multiple) {
      return (value as string[] | undefined) ?? [];
    }
    return (value as string | undefined) ? [(value as string)] : [];
  }, [value, multiple]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = (value as string[] | undefined) ?? [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      (onValueChange as ((value: string[]) => void) | undefined)?.(newValues);
    } else {
      const newValue =
        (value as string | undefined) === optionValue ? "" : optionValue;
      (onValueChange as ((value: string) => void) | undefined)?.(newValue);
      setOpen(false);
    }
  };

  const handleRemove = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    if (multiple) {
      const currentValues = (value as string[] | undefined) ?? [];
      const newValues = currentValues.filter((v) => v !== optionValue);
      (onValueChange as ((value: string[]) => void) | undefined)?.(newValues);
    }
  };

  const displayLabel = React.useMemo(() => {
    if (multiple) {
      const values = (value as string[] | undefined) ?? [];
      if (values.length === 0) return placeholder;
      if (values.length === 1) {
        return options.find((o) => o.value === values[0])?.label ?? placeholder;
      }
      return `${values.length} selected`;
    }
    return (
      options.find((o) => o.value === (value as string | undefined))?.label ??
      placeholder
    );
  }, [value, multiple, options, placeholder]);

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 w-full justify-between font-normal",
            !value || (Array.isArray(value) && value.length === 0)
              ? "text-muted-foreground"
              : "",
            triggerClassName
          )}
        >
          {multiple && selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedValues.map((v) => {
                const option = options.find((o) => o.value === v);
                return (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {option?.icon && (
                      <option.icon className="size-3" />
                    )}
                    {option?.label}
                    <button
                      type="button"
                      className="hover:text-foreground ml-1 rounded-full"
                      onClick={(e) => handleRemove(e, v)}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span>{displayLabel}</span>
          )}
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", className)} align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="text-muted-foreground mr-2 size-4 shrink-0" />
            <input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  {option.icon && (
                    <option.icon className="mr-2 size-4" />
                  )}
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormControl } from "./form";
import { Button } from "./button";
import { cn } from "~/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";

export default function ComboBox(props: {
  value: string;
  onChange: (...event: any[]) => void;
  data: { value: string; label: string }[];
  placeholder?: string;
  searchMessage?: string;
  emptyMessage?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between",
              !props.value && "text-muted-foreground",
            )}
          >
            {props.value
              ? props.data.find((el) => el.value === props.value)?.label
              : props.placeholder ?? "Select"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={props.searchMessage ?? "Search..."}
            className="h-9"
          />
          <CommandEmpty>{props.emptyMessage ?? "No data found."}</CommandEmpty>
          <CommandGroup>
            {props.data.map((el) => (
              <CommandItem
                value={el.label}
                key={el.value}
                onSelect={() => {
                  props.onChange(el.value);
                  setOpen(false);
                  // form.setValue("language", language.value);
                }}
              >
                {el.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    el.value === props.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

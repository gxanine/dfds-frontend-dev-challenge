import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormControl } from "./form";
import { Button } from "./button";
import { cn } from "~/utils";
import { Badge } from "./badge";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";

export default function MultiSelect(props: {
  value: string[];
  onChange: (...event: any[]) => void;
  data: { value: string; label: string }[];
  placeholder?: string;
  searchMessage?: string;
  emptyMessage?: string;
}) {
  const [open, setOpen] = useState(true);

  function handleSelect(value: string) {
    const isAlreadySelected = props.value.includes(value);
    const newArr = isAlreadySelected
      ? props.value.filter((x) => x !== value)
      : [...props.value, value];

    props.onChange(newArr);
  }

  function handleBadgeClick(event: any, value: string) {
    event.preventDefault();
    event.stopPropagation();
    handleSelect(value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "h-auto justify-between text-left",
              !props.value && "text-muted-foreground",
            )}
          >
            <div className="flex flex-wrap gap-1">
              {props.value && props.value.length > 0
                ? props.data
                    .filter((el) => props.value.includes(el.value))
                    ?.map((el) => (
                      <Badge
                        key={el.value}
                        onClick={(e) => handleBadgeClick(e, el.value)}
                      >
                        {el.label}
                      </Badge>
                    ))
                : props.placeholder ?? "Select"}
            </div>
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
                  handleSelect(el.value);
                  // setOpen(false);
                  // form.setValue("language", language.value);
                }}
              >
                {el.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    props.value.includes(el.value)
                      ? "opacity-100"
                      : "opacity-0",
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

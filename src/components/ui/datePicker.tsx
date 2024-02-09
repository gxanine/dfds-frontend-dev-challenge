import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormControl } from "./form";
import { Button } from "./button";
import { cn } from "~/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "./calendar";

export default function DatePicker(props: {
  value: Date;
  onChange: (...event: any[]) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleOnChange(...event: any[]) {
    setOpen(false);
    props.onChange(...event);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "pl-3 text-left font-normal",
              !props.value && "text-muted-foreground",
            )}
          >
            {props.value ? (
              format(props.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.value}
          onSelect={handleOnChange}
        />
      </PopoverContent>
    </Popover>
  );
}

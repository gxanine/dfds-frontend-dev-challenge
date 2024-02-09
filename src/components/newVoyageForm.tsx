import { ReactNode, useEffect, useState } from "react";
import { z } from "zod";
import { fetchData, mergeTimeAndDate } from "~/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VesselsType } from "~/pages/api/vessel/getAll";
import { UnitType } from "@prisma/client";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import MultiSelect from "./ui/multiSelect";
import DatePicker from "./ui/datePicker";
import { Input } from "./ui/input";
import ComboBox from "./ui/comboBox";

export type VoyageCandidate = {
  departure: Date;
  arrival: Date;
  portOfLoading: string;
  portOfDischarge: string;
  vessel: string; // Vessel's ID
  unitTypes: string[]; // List of unit type IDs
};

const formSchema = z
  .object({
    departureDate: z.date(),
    departureTime: z.string().regex(/[0-9]{2}:[0-9]{2}/),
    arrivalDate: z.date(),
    arrivalTime: z.string().regex(/[0-9]{2}:[0-9]{2}/),
    portOfLoading: z.string().trim().min(1),
    portOfDischarge: z.string().trim().min(1),
    vessel: z.string().trim().min(1),
    unitTypes: z.array(z.string()).nonempty().min(5),
  })
  .required()
  .refine(
    (data) =>
      mergeTimeAndDate(data.departureTime, data.departureDate) <
      mergeTimeAndDate(data.arrivalTime, data.arrivalDate),
    {
      message: "Arrival must be later than departure",
      path: ["arrivalDate"],
    },
  );

export default function NewVoyageForm({
  onSubmit,
}: {
  onSubmit?: (voyage: VoyageCandidate) => void;
}) {
  type ComboBoxData = { value: string; label: string }[];
  const [vessels, setVessels] = useState<VesselsType>([]);
  const [unitTypes, setUnitTypes] = useState<ComboBoxData>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departureDate: new Date(),
      departureTime: "00:00",
      arrivalDate: new Date(),
      arrivalTime: "00:01",
      portOfLoading: "test",
      portOfDischarge: "test",
      vessel: "clsaffxia00007w64mddkzobr",
      unitTypes: [],
    },
  });

  useEffect(() => {
    fetchData("vessel/getAll").then((data) => {
      setVessels(data);
    });
    fetchData("unitType/getAll").then((data) => {
      setUnitTypes(
        data?.map((unit: UnitType) => ({ value: unit.id, label: unit.name })),
      );
    });
  }, []);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const {
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      ...otherValues
    } = values;
    const departure = mergeTimeAndDate(departureTime, departureDate);
    const arrival = mergeTimeAndDate(arrivalTime, arrivalDate);

    const payload = {
      departure,
      arrival,
      ...otherValues,
    };

    onSubmit?.(payload);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid gap-4 py-4"
        >
          <FormGroup>
            <FormField
              control={form.control}
              name={"departureDate"}
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col">
                  <FormLabel>Departure</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"departureTime"}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="opacity-0">Time</FormLabel>
                  <Input
                    className="mt-5 text-center"
                    type="time"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGroup>
          <FormGroup>
            <FormField
              control={form.control}
              name={"arrivalDate"}
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col">
                  <FormLabel>Arrival</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"arrivalTime"}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="opacity-0">Time</FormLabel>
                  <Input
                    className="text-center"
                    type="time"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGroup>

          <FormField
            control={form.control}
            name={"portOfLoading"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port of loading</FormLabel>
                <FormControl>
                  <Input placeholder="Oslo" {...field} />
                </FormControl>
                <FormDescription>The beginning of the voyage</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"portOfDischarge"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port of discharge</FormLabel>
                <FormControl>
                  <Input placeholder="Copenhagen" {...field} />
                </FormControl>
                <FormDescription>The destination of the voyage</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"vessel"}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vessel</FormLabel>
                <ComboBox
                  value={field.value}
                  onChange={field.onChange}
                  data={vessels}
                  placeholder="Select vessel"
                  emptyMessage="No vessel found."
                  searchMessage="Search vessel..."
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"unitTypes"}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Unit types</FormLabel>
                <MultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  data={unitTypes}
                  placeholder="Select unit types"
                  emptyMessage="No unit types found."
                  searchMessage="Search unit types..."
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

function FormGroup({ children }: { children?: ReactNode[] | ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

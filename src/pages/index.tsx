import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import Head from "next/head";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fetchData } from "~/utils";
import type { ReturnType } from "./api/voyage/getAll";
import { Button } from "~/components/ui/button";
import { TABLE_DATE_FORMAT } from "~/constants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toast } from "~/components/ui/use-toast";
import NewVoyageForm, { VoyageCandidate } from "~/components/newVoyageForm";
import UnitTypesList from "~/components/unitTypeList";

export default function Home() {
  const { data: voyages } = useQuery<ReturnType>({
    queryKey: ["voyages"],

    queryFn: () => fetchData("voyage/getAll"),
  });

  const queryClient = useQueryClient();
  const deleteVoyageMutation = useMutation({
    mutationFn: async (voyageId: string) => {
      const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the voyage");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "voyages",
      ] as InvalidateQueryFilters);
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: err.message,
      });
    },
  });

  const newVoyageMutation = useMutation({
    mutationFn: async (voyage: VoyageCandidate) => {
      const response = await fetch("/api/voyage/create", {
        method: "POST",
        body: JSON.stringify(voyage),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("New voyage could not be created.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "voyages",
      ] as InvalidateQueryFilters);
      toast({
        title: "Success!",
        description: "New voyage  has been created!",
      });
    },
    onError: async (err) => {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: err.message,
      });
    },
  });

  const handleDelete = (voyageId: string) => {
    deleteVoyageMutation.mutate(voyageId);
  };

  const handleNew = (voyage: VoyageCandidate) => {
    newVoyageMutation.mutate(voyage);
  };

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="m-5 flex flex-col self-start">
          <NewVoyageSheet handleNew={handleNew} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>Unit types</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  {format(
                    new Date(voyage.scheduledDeparture),
                    TABLE_DATE_FORMAT,
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <TableCell className="cursor-pointer">
                      {voyage.unitTypes.length}
                    </TableCell>
                  </PopoverTrigger>
                  <PopoverContent>
                    <UnitTypesList unitTypes={voyage.unitTypes} />
                  </PopoverContent>
                </Popover>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(voyage.id)}
                    variant="outline"
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}

function NewVoyageSheet(props: {
  handleNew: (voyage: VoyageCandidate) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(voyage: VoyageCandidate) {
    props.handleNew(voyage);
    setIsOpen(false);
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button>Create</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create a new voyage</SheetTitle>
            <SheetDescription>
              This will create a brand new voyage
            </SheetDescription>
          </SheetHeader>
          <NewVoyageForm onSubmit={handleSubmit} />
        </SheetContent>
      </Sheet>
    </>
  );
}

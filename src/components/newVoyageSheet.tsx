import { useState } from "react";
import NewVoyageForm, { VoyageCandidate } from "./newVoyageForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "./ui/use-toast";

export default function NewVoyageSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
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

  function handleSubmit(voyage: VoyageCandidate) {
    setIsOpen(false);
    mutation.mutate(voyage);
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

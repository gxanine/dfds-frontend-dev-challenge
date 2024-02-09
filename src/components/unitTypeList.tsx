import { UnitType } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function UnitTypesList(props: { unitTypes: UnitType[] }) {
  if (props.unitTypes.length < 1)
    return (
      <>
        <span className="block text-center text-xs opacity-75">
          There's no unit types assigned to this voyage.
        </span>
      </>
    );

  return (
    <>
      <span>Unit types</span>
      <Table className="text-xs">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Default length</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.unitTypes.map((unitType) => (
            <TableRow key={unitType.id}>
              <TableCell>{unitType.name}</TableCell>
              <TableCell>{unitType.defaultLength}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

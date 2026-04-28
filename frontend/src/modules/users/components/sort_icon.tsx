import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface SortIconProps {
  isSorted: false | "asc" | "desc";
}

export function SortIcon({ isSorted }: SortIconProps) {
  if (isSorted === "asc") return <ArrowUp className="ml-1.5 size-3 inline" />;
  if (isSorted === "desc")
    return <ArrowDown className="ml-1.5 size-3 inline" />;
  return (
    <ArrowUpDown className="ml-1.5 size-3 inline opacity-40 group-hover:opacity-70" />
  );
}

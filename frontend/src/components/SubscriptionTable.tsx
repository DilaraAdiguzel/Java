import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate, usd } from "@/lib/api";
import type { Subscription } from "@/lib/types";
import { RiskScore, StatusBadge, VendorAvatar } from "./common";

interface Props {
  data: Subscription[];
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  onRowClick: (s: Subscription) => void;
  onCancel: (s: Subscription) => void;
  empty: React.ReactNode;
}

function SortHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:text-foreground">
      {label} <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export function SubscriptionTable({ data, globalFilter, columnFilters, onRowClick, onCancel, empty }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "cost", desc: true }]);

  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        accessorKey: "vendor",
        header: ({ column }) => <SortHeader label="Vendor" onClick={() => column.toggleSorting()} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <VendorAvatar name={row.original.vendor} />
            <div className="min-w-0">
              <div className="font-medium">{row.original.vendor}</div>
              <div className="truncate text-xs text-muted-foreground">{row.original.website}</div>
            </div>
          </div>
        ),
      },
      { accessorKey: "category", header: "Category", filterFn: "equals", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span> },
      {
        accessorKey: "cost",
        header: ({ column }) => <SortHeader label="Cost" onClick={() => column.toggleSorting()} />,
        cell: ({ row }) => <span className="font-medium tabular-nums">{usd(row.original.cost, 2)}</span>,
      },
      { accessorKey: "billingCycle", header: "Billing cycle", filterFn: "equals", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span> },
      {
        accessorKey: "nextRenewal",
        header: ({ column }) => <SortHeader label="Next renewal" onClick={() => column.toggleSorting()} />,
        cell: ({ getValue }) => <span className="tabular-nums text-muted-foreground">{formatDate(getValue<string>())}</span>,
      },
      { accessorKey: "owner", header: "Owner", cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<string>()}</span> },
      {
        accessorKey: "riskScore",
        header: ({ column }) => <SortHeader label="Risk score" onClick={() => column.toggleSorting()} />,
        cell: ({ getValue }) => <RiskScore score={getValue<number>()} />,
      },
      { accessorKey: "status", header: "Status", filterFn: "equals", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${row.original.vendor}`}><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRowClick(row.original)}>View details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRowClick(row.original)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger focus:text-danger" disabled={row.original.status === "Cancelled"} onClick={() => onCancel(row.original)}>
                  Cancel subscription
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onRowClick, onCancel],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border">
              {hg.headers.map((h) => (
                <th key={h.id} className="h-10 px-4 text-left text-xs font-medium text-muted-foreground first:pl-5">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length}>{empty}</td></tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                tabIndex={0}
                onClick={() => onRowClick(row.original)}
                onKeyDown={(e) => e.key === "Enter" && onRowClick(row.original)}
                className="cursor-pointer border-b border-border/70 transition-colors duration-150 last:border-0 hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="h-14 px-4 first:pl-5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

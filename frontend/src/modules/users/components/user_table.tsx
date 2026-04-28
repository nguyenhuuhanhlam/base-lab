import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Pencil,
} from "lucide-react";
import { type UserRecord } from "../hooks/use_users";
import { AUTH_DISPLAY_FIELD } from "@/lib/constants";
import { UserAvatar } from "./user_avatar";
import { SortIcon } from "./sort_icon";

interface UserTableProps {
  users: UserRecord[];
  isLoading: boolean;
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
}

export function UserTable({ users, isLoading, selectedUserId, onSelectUser }: UserTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<UserRecord>[]>(() => [
    {
      id: "name",
      accessorFn: (row) =>
        (row[AUTH_DISPLAY_FIELD] as string | undefined) ||
        row.displayName ||
        "",
      header: ({ column }) => (
        <button
          className="group flex items-center text-xs font-medium cursor-pointer select-none"
          onClick={column.getToggleSortingHandler()}
        >
          Tên / Tổ chức
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ row }) => {
        const name =
          (row.original[AUTH_DISPLAY_FIELD] as string | undefined) ||
          row.original.displayName;
        return (
          <div className="flex items-center gap-2.5">
            <UserAvatar
              name={name}
              email={row.original.email}
              photoURL={row.original.photoURL}
            />
            <span className="text-sm font-medium">
              {name || <span className="text-muted-foreground font-normal">—</span>}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <button
          className="group flex items-center text-xs font-medium cursor-pointer select-none"
          onClick={column.getToggleSortingHandler()}
        >
          Email
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {(getValue() as string) || "—"}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <button
          className="group flex items-center text-xs font-medium cursor-pointer select-none"
          onClick={column.getToggleSortingHandler()}
        >
          Vai trò
          <SortIcon isSorted={column.getIsSorted()} />
        </button>
      ),
      cell: ({ getValue }) => {
        const role = (getValue() as string) || "user";
        const isAdmin = role === "admin";
        const isManager = role === "manager";

        if (isAdmin) {
          return (
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950 font-medium text-[10px] uppercase px-1.5 h-4 shadow-none">
              Admin
            </Badge>
          );
        }
        if (isManager) {
          return (
            <Badge className="bg-green-50 text-green-700 border-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-950 font-medium text-[10px] uppercase px-1.5 h-4 shadow-none">
              Manager
            </Badge>
          );
        }
        return (
          <span className="text-xs text-muted-foreground capitalize">{role}</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="text-xs font-medium">Thao tác</span>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onSelectUser(row.original.id);
            }}
          >
            <Pencil className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ], [onSelectUser]);

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: (val) => {
      setGlobalFilter(val);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  const rows = table.getRowModel().rows;
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const skeletonRows = useMemo(() => Array.from({ length: pagination.pageSize }), [pagination.pageSize]);

  return (
    <div className="flex flex-col gap-4 h-full pr-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Users size={16} />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight">Users</h1>
            <p className="text-xs text-muted-foreground">
              Danh sách người dùng đã đăng ký
            </p>
          </div>
        </div>
        {!isLoading && (
          <span className="text-xs text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-full">
            {totalFiltered} / {users.length}
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Tìm theo tên hoặc email…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden bg-card flex-1 min-h-0">
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur-sm">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="hover:bg-transparent">
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="text-xs h-9 px-3">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                skeletonRows.map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="size-7 rounded-full shrink-0" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <Skeleton className="h-3 w-40" />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <Skeleton className="h-3 w-16" />
                    </TableCell>
                    <TableCell className="px-3 py-2.5">
                      <Skeleton className="h-3 w-12" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="py-12 text-center">
                    <Users size={32} className="mx-auto mb-2 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">
                      {globalFilter ? "Không tìm thấy kết quả" : "Chưa có người dùng nào"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow 
                    key={row.id} 
                    className={`cursor-pointer transition-colors ${selectedUserId === row.original.id ? "bg-muted/60" : ""}`}
                    onClick={() => onSelectUser(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && totalFiltered > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground py-2">
          <span>
            Trang{" "}
            <span className="font-medium text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>
            {" "}/ {table.getPageCount()}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={(e) => { e.stopPropagation(); table.previousPage(); }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={(e) => { e.stopPropagation(); table.nextPage(); }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

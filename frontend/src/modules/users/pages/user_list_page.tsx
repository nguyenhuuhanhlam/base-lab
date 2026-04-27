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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
} from "lucide-react";
import { useUsers, type UserRecord } from "../hooks/use_users";
import { AUTH_DISPLAY_FIELD } from "@/lib/constants";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name?: string, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

function formatDate(ts?: { seconds: number } | null): string {
  if (!ts?.seconds) return "—";
  return new Date(ts.seconds * 1000).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function UserAvatar({
  name,
  email,
  photoURL,
}: {
  name?: string;
  email?: string;
  photoURL?: string;
}) {
  const initials = getInitials(name, email);
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name || email || "avatar"}
        className="size-7 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-semibold shrink-0">
      {initials}
    </div>
  );
}

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (isSorted === "asc") return <ArrowUp className="ml-1.5 size-3 inline" />;
  if (isSorted === "desc")
    return <ArrowDown className="ml-1.5 size-3 inline" />;
  return (
    <ArrowUpDown className="ml-1.5 size-3 inline opacity-40 group-hover:opacity-70" />
  );
}

// ─── Column Definitions ──────────────────────────────────────────────────────

const columns: ColumnDef<UserRecord>[] = [
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
    id: "uid",
    accessorFn: (row) => row.uid || row.id,
    header: () => <span className="text-xs font-medium">UID</span>,
    cell: ({ getValue }) => {
      const uid = getValue() as string;
      return (
        <code
          className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono cursor-default"
          title={uid}
        >
          {uid ? uid.slice(0, 8) + "…" : "—"}
        </code>
      );
    },
    enableSorting: false,
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
    id: "createdAt",
    accessorFn: (row) => row.createdAt?.seconds ?? 0,
    header: ({ column }) => (
      <button
        className="group flex items-center text-xs font-medium cursor-pointer select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Ngày tạo
        <SortIcon isSorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
];

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function UserListPage() {
  const { users, isLoading, error } = useUsers();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const skeletonRows = useMemo(() => Array.from({ length: pagination.pageSize }), [pagination.pageSize]);

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: (val) => {
      setGlobalFilter(val);
      setPagination((p) => ({ ...p, pageIndex: 0 })); // reset về trang 1 khi search
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

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
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
          id="user-search"
          placeholder="Tìm theo tên hoặc email…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          Lỗi tải dữ liệu: {error}
        </p>
      )}

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/50 hover:bg-muted/50">
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
                    <Skeleton className="h-3 w-20" />
                  </TableCell>
                  <TableCell className="px-3 py-2.5">
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  <TableCell className="px-3 py-2.5">
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-12 text-center">
                  <Users
                    size={32}
                    className="mx-auto mb-2 text-muted-foreground opacity-30"
                  />
                  <p className="text-sm text-muted-foreground">
                    {globalFilter
                      ? "Không tìm thấy kết quả"
                      : "Chưa có người dùng nào"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && totalFiltered > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Page info */}
          <span>
            Trang{" "}
            <span className="font-medium text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>
            {" "}/ {table.getPageCount()}
            {" "}·{" "}
            <span className="font-medium text-foreground">{totalFiltered}</span>{" "}kết quả
          </span>

          <div className="flex items-center gap-2">
            {/* Page size selector */}
            <div className="flex items-center gap-1.5">
              <span>Hiển thị</span>
              <select
                value={pagination.pageSize}
                onChange={(e) =>
                  setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })
                }
                className="h-7 rounded-md border border-input bg-background px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Prev / Next */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

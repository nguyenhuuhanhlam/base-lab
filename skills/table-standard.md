# Table Standard — shadcn/ui + TanStack Table

Tài liệu này quy định chuẩn hiển thị dạng bảng (table) cho toàn bộ dự án.

## Quy tắc bắt buộc

- **Mọi component dạng table đều phải dùng 2 thành phần:**
  1. **`@/components/ui/table`** (shadcn) — cung cấp các primitive: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
  2. **`@tanstack/react-table`** — quản lý toàn bộ state của table: column definitions, sorting, filtering, pagination

- **Không tự viết `<table>` / `<thead>` / `<tr>` / `<td>` thủ công** — luôn dùng shadcn primitives

## Pattern chuẩn

```tsx
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
  Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell,
} from "@/components/ui/table";

// 1. Định nghĩa columns
const columns: ColumnDef<MyData>[] = [
  { accessorKey: "name", header: "Tên" },
  { accessorKey: "email", header: "Email" },
];

// 2. State
const [sorting, setSorting] = useState<SortingState>([]);
const [globalFilter, setGlobalFilter] = useState("");
const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

// 3. Khởi tạo table instance
const table = useReactTable({
  data,
  columns,
  state: { sorting, globalFilter, pagination },
  onSortingChange: setSorting,
  onGlobalFilterChange: (val) => { setGlobalFilter(val); setPagination(p => ({ ...p, pageIndex: 0 })); },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  globalFilterFn: "includesString",
});

// 4. Render
<Table>...</Table>

// 5. Pagination footer
<div className="flex items-center justify-between text-xs text-muted-foreground">
  <span>Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
  <div className="flex gap-1">
    <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
      <ChevronLeft />
    </Button>
    <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
      <ChevronRight />
    </Button>
  </div>
</div>
```

## Các tính năng thường dùng

| Tính năng | TanStack API |
|---|---|
| Sorting | `getSortedRowModel()` + `column.getToggleSortingHandler()` |
| Global filter | `getFilteredRowModel()` + `globalFilter` state |
| Pagination | `getPaginationRowModel()` + `table.nextPage()` |
| Row selection | `enableRowSelection: true` + `rowSelection` state |

## Dependencies

```bash
# TanStack Table đã có trong package.json (via @tanstack/react-query dependency group)
npm install @tanstack/react-table
```

| Package | Version |
|---|---|
| @tanstack/react-table | ^8.x |
| shadcn table component | `npx shadcn@latest add table` |

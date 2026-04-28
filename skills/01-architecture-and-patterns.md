# Architecture & Patterns

> Stack: React + Vite, Firebase, Zustand, shadcn/ui, TanStack Table/Query

---

## 1. Module-based Architecture

**Convention:** Mỗi feature = 1 module độc lập, tự khai báo route. Router chỉ collect.

### Cấu trúc thư mục

```
src/
├── modules/
│   ├── auth/
│   │   ├── index.ts          ← export routes của module
│   │   ├── pages/
│   │   └── components/
│   └── [feature]/
│       └── index.ts
├── router/
│   ├── index.ts              ← collect tất cả routes
│   ├── PrivateRoute.tsx
│   └── types.ts
├── layouts/
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
└── App.tsx
```

### Quy tắc
1. Mỗi module có `index.ts` export mảng routes
2. Tất cả page components dùng `React.lazy()` — không import trực tiếp
3. Router không biết về UI — chỉ collect routes từ các module
4. Layout mặc định là `"main"`, override khi cần `"auth"` hoặc `"none"`
5. `auth: true` = route cần đăng nhập

### Types & Route định nghĩa

```ts
// router/types.ts
export interface AppRoute {
  path: string;
  component: LazyExoticComponent<any>;
  layout?: "main" | "auth" | "none";
  auth?: boolean;
}

// modules/auth/index.ts
export const authRoutes: AppRoute[] = [
  { path: "/login", component: lazy(() => import("./pages/LoginPage")), layout: "auth", auth: false },
];
```

### Router & App.tsx

```ts
// router/index.ts
export const allRoutes: AppRoute[] = [...authRoutes, ...dashboardRoutes, ...productRoutes];
```

```tsx
// App.tsx — render routes tự động
const layoutMap = { main: MainLayout, auth: AuthLayout, none: ({ children }) => <>{children}</> };
const router = createBrowserRouter(
  allRoutes.map(({ path, component: Component, layout = "main", auth = false }) => {
    const Layout = layoutMap[layout];
    const element = (
      <Layout><Suspense fallback={<div>Loading...</div>}>
        {auth ? <PrivateRoute><Component /></PrivateRoute> : <Component />}
      </Suspense></Layout>
    );
    return { path, element };
  })
);
```

### Thêm module mới — 2 bước
```
# Bước 1: tạo folder + index.ts
src/modules/orders/index.ts  →  export const orderRoutes: AppRoute[] = [...]

# Bước 2: đăng ký vào router/index.ts
import { orderRoutes } from "@/modules/orders";
export const allRoutes = [..., ...orderRoutes];
```

---

## 2. Table Standard — shadcn/ui + TanStack Table v8

**Bắt buộc:** Mọi table phải dùng `shadcn Table primitives` + `@tanstack/react-table`. Không viết `<table>/<tr>/<td>` thủ công.

```tsx
import { useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel, flexRender,
  type ColumnDef, type SortingState, type PaginationState } from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
  from "@/components/ui/table";

const columns: ColumnDef<MyData>[] = [
  { accessorKey: "name", header: "Tên" },
  { accessorKey: "email", header: "Email" },
];

const [sorting, setSorting] = useState<SortingState>([]);
const [globalFilter, setGlobalFilter] = useState("");
const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

const table = useReactTable({
  data, columns,
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
```

| Tính năng | API |
|---|---|
| Sorting | `getSortedRowModel()` + `column.getToggleSortingHandler()` |
| Global filter | `getFilteredRowModel()` + `globalFilter` state |
| Pagination | `getPaginationRowModel()` + `table.nextPage()` |
| Row selection | `enableRowSelection: true` + `rowSelection` state |

---

## 3. Data & Storage — Firebase

**Stack:** Firestore (data) + Firebase Storage (files) + Firebase Auth (xác thực).

```ts
// Luôn dùng modular API v12+ — không dùng compat
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
```

### Quy tắc khi làm với AI
- Mặc định dùng **Firestore** — không đề xuất REST API hay DB khác
- Upload file → **Firebase Storage**
- **Không dùng `orderBy` phía server** khi fetch list nếu documents có thể thiếu field → sort client-side để tránh Firestore silently drop records
- Centralize tên collection/field trong `src/lib/constants.ts` (e.g. `AUTH_COLLECTION`, `AUTH_DISPLAY_FIELD`)

### Auth Store (Zustand)
- Bọc store bằng `persist` middleware → lưu `localStorage`
- Thêm `isInitializing` state để tránh nháy UI khi F5
- `PrivateRoute` & `LoginPage` ưu tiên đọc `isLoggedIn` từ cache trước
- Real-time sync profile: dùng `useAuthSync` + `onSnapshot`

---

## 4. RBAC — Role-based Access Control

- `RoleRoute` guard bảo vệ route nhạy cảm
- Sidebar phân section: **Manager** section chỉ hiển thị cho `admin` / `manager`
- Badge màu theo role:
  - `admin` → Blue (blue-50/700)
  - `manager` → Green (green-50/700)

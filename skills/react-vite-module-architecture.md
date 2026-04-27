# React + Vite — Module-based Architecture

> Convention: mỗi feature là một module độc lập, tự khai báo route của mình. App chỉ collect lại.

---

## Cấu trúc thư mục

```
src/
├── modules/
│   ├── auth/
│   │   ├── index.ts              ← khai báo routes của module
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── components/
│   │   └── hooks/
│   ├── dashboard/
│   │   ├── index.ts
│   │   └── pages/DashboardPage.tsx
│   └── products/
│       ├── index.ts
│       └── pages/
│           ├── ProductListPage.tsx
│           └── ProductDetailPage.tsx
├── router/
│   ├── index.ts                  ← collect tất cả routes
│   ├── PrivateRoute.tsx
│   └── types.ts
├── layouts/
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
└── App.tsx
```

---

## Quy tắc

1. **Mỗi module = 1 folder** trong `src/modules/`
2. **Mỗi module có `index.ts`** — export mảng routes của module đó
3. **Router không biết về UI** — chỉ collect routes từ các module
4. **Thêm module mới chỉ cần 2 bước:** tạo folder + đăng ký vào `router/index.ts`
5. **Lazy load mặc định** — dùng `React.lazy()` cho tất cả page components

---

## Types

```ts
// router/types.ts
import { LazyExoticComponent } from "react";

export interface AppRoute {
  path: string;
  component: LazyExoticComponent<any>;
  layout?: "main" | "auth" | "none";
  auth?: boolean; // true = yêu cầu đăng nhập
}
```

---

## Module khai báo routes

```ts
// modules/auth/index.ts
import { lazy } from "react";
import { AppRoute } from "@/router/types";

export const authRoutes: AppRoute[] = [
  {
    path: "/login",
    component: lazy(() => import("./pages/LoginPage")),
    layout: "auth",
    auth: false,
  },
  {
    path: "/register",
    component: lazy(() => import("./pages/RegisterPage")),
    layout: "auth",
    auth: false,
  },
];
```

```ts
// modules/products/index.ts
import { lazy } from "react";
import { AppRoute } from "@/router/types";

export const productRoutes: AppRoute[] = [
  {
    path: "/products",
    component: lazy(() => import("./pages/ProductListPage")),
    layout: "main",
    auth: true,
  },
  {
    path: "/products/:id",
    component: lazy(() => import("./pages/ProductDetailPage")),
    layout: "main",
    auth: true,
  },
];
```

---

## Router — collect tất cả

```ts
// router/index.ts
import { authRoutes } from "@/modules/auth";
import { dashboardRoutes } from "@/modules/dashboard";
import { productRoutes } from "@/modules/products";
import { AppRoute } from "./types";

export const allRoutes: AppRoute[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...productRoutes,
];
```

---

## PrivateRoute

```tsx
// router/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
```

---

## App.tsx — render routes tự động

```tsx
// App.tsx
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "@/router";
import { PrivateRoute } from "@/router/PrivateRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

const layoutMap = {
  main: MainLayout,
  auth: AuthLayout,
  none: ({ children }: any) => <>{children}</>,
};

const router = createBrowserRouter(
  allRoutes.map(({ path, component: Component, layout = "main", auth = false }) => {
    const Layout = layoutMap[layout];

    const element = (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          {auth
            ? <PrivateRoute><Component /></PrivateRoute>
            : <Component />
          }
        </Suspense>
      </Layout>
    );

    return { path, element };
  })
);

export default function App() {
  return <RouterProvider router={router} />;
}
```

---

## vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

---

## Thêm module mới — 2 bước

**Bước 1:** Tạo module

```
src/modules/orders/
├── index.ts
└── pages/OrderListPage.tsx
```

```ts
// modules/orders/index.ts
import { lazy } from "react";
import { AppRoute } from "@/router/types";

export const orderRoutes: AppRoute[] = [
  {
    path: "/orders",
    component: lazy(() => import("./pages/OrderListPage")),
    layout: "main",
    auth: true,
  },
];
```

**Bước 2:** Đăng ký vào router

```ts
// router/index.ts
import { orderRoutes } from "@/modules/orders"; // thêm
export const allRoutes = [..., ...orderRoutes];  // thêm
```

Không cần đụng vào file nào khác.

---

## Dependencies

```bash
npm install react-router-dom
```

| Package | Version |
|---|---|
| react-router-dom | ^6.x |
| vite | ^5.x |
| @vitejs/plugin-react | ^4.x |

---

## Lưu ý khi dùng với AI

- Khi tạo module mới, yêu cầu AI tạo đúng 3 file: `index.ts`, page component, và cập nhật `router/index.ts`
- Layout mặc định là `"main"`, chỉ override khi cần `"auth"` hoặc `"none"`
- Tất cả page components đều phải dùng `lazy()` — không import trực tiếp
- `auth: true` = route cần đăng nhập, `auth: false` = public route

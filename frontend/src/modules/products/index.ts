import { lazy } from "react";
import type { AppRoute } from "@/router/types";

export const productRoutes: AppRoute[] = [
  {
    path: "/products",
    component: lazy(() => import("./pages/product_list_page")),
    layout: "main",
    auth: true,
  },
];

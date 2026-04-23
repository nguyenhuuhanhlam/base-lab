import { lazy } from "react";
import type { AppRoute } from "@/router/types";

export const dashboardRoutes: AppRoute[] = [
  {
    path: "/",
    component: lazy(() => import("./pages/dashboard_page")),
    layout: "main",
    auth: true,
  },
];

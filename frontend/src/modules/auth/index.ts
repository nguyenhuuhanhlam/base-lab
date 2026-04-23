import { lazy } from "react";
import type { AppRoute } from "@/router/types";

export const authRoutes: AppRoute[] = [
  {
    path: "/login",
    component: lazy(() => import("./pages/login_page")),
    layout: "auth",
    auth: false,
  },
];

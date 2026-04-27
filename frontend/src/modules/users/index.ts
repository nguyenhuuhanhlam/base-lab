import { lazy } from "react";
import type { AppRoute } from "@/router/types";

export const userRoutes: AppRoute[] = [
  {
    path: "/users",
    component: lazy(() => import("./pages/user_list_page")),
    layout: "main",
    auth: true,
    roles: ["admin", "manager"],
  },
];

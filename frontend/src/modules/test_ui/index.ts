import { lazy } from "react";
import type { AppRoute } from "@/router/types";

export const testUiRoutes: AppRoute[] = [
  {
    path: "/test-ui",
    component: lazy(() => import("./pages/test_ui_page")),
    layout: "main",
    auth: false,
  },
];

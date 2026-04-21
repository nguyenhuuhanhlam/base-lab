import { authRoutes } from "@/modules/auth";
import { dashboardRoutes } from "@/modules/dashboard";
import type { AppRoute } from "./types";

export const allRoutes: AppRoute[] = [
  ...authRoutes,
  ...dashboardRoutes,
];

import { authRoutes } from "@/modules/auth";
import { dashboardRoutes } from "@/modules/dashboard";
import { productRoutes } from "@/modules/products";
import type { AppRoute } from "./types";

export const allRoutes: AppRoute[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...productRoutes,
];

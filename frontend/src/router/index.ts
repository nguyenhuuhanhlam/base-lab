import { authRoutes } from "@/modules/auth";
import { dashboardRoutes } from "@/modules/dashboard";
import { productRoutes } from "@/modules/products";
import { userRoutes } from "@/modules/users";
import { testUiRoutes } from "@/modules/test_ui";
import type { AppRoute } from "./types";

export const allRoutes: AppRoute[] = [
  ...authRoutes,
  ...dashboardRoutes,
  ...productRoutes,
  ...userRoutes,
  ...testUiRoutes,
];

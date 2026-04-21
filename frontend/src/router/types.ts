import type { LazyExoticComponent } from "react";

export interface AppRoute {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: LazyExoticComponent<any>;
  layout?: "main" | "auth" | "none";
  auth?: boolean; // true = yêu cầu đăng nhập
}

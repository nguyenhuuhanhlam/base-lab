import type { LazyExoticComponent } from "react";

export type UserRole = "admin" | "manager" | "user";

export interface AppRoute {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: LazyExoticComponent<any>;
  layout?: "main" | "auth" | "none";
  auth?: boolean;       // true = yêu cầu đăng nhập
  roles?: UserRole[];   // nếu có, chỉ cho phép các role này truy cập
}

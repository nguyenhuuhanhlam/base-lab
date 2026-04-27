import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth_store";
import type { UserRole } from "@/router/types";
import { Loader2 } from "lucide-react";

interface RoleRouteProps {
  children: React.ReactNode;
  roles: UserRole[];
}

/**
 * Bảo vệ route theo role.
 * - Chưa đăng nhập → redirect /login
 * - Đã đăng nhập nhưng sai role → redirect / (403)
 * - Đúng role → render children
 */
export function RoleRoute({ children, roles }: RoleRouteProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const profile = useAuthStore((s) => s.profile);

  if (isInitializing && !isLoggedIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-stone-700" />
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const userRole = (profile?.role as UserRole | undefined) ?? "user";
  const hasAccess = roles.includes(userRole);

  if (!hasAccess) return <Navigate to="/" replace />;

  return <>{children}</>;
}

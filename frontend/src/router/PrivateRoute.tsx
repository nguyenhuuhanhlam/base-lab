import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

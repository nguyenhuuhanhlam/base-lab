import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "@/router";
import { PrivateRoute } from "@/router/private_route";
import { RoleRoute } from "@/router/role_route";
import { MainLayout } from "@/layouts/main_layout";
import { AuthLayout } from "@/layouts/auth_layout";
import { useAuthSync } from "@/hooks/use_auth_sync";
import "./app.css";

import { Loader2 } from "lucide-react";

const layoutMap = {
  main: MainLayout,
  auth: AuthLayout,
  none: ({ children }: { children: React.ReactNode }) => <>{children}</>,
};

const router = createBrowserRouter(
  allRoutes.map(({ path, component: Component, layout = "main", auth = false, roles }) => {
    const Layout = layoutMap[layout];

    let content = <Component />;
    if (roles && roles.length > 0) {
      content = <RoleRoute roles={roles}><Component /></RoleRoute>;
    } else if (auth) {
      content = <PrivateRoute><Component /></PrivateRoute>;
    }

    const element = (
      <Layout>
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center bg-stone-50">
              <Loader2 className="h-8 w-8 animate-spin text-stone-700" />
            </div>
          }
        >
          {content}
        </Suspense>
      </Layout>
    );

    return { path, element };
  })
);

export default function App() {
  useAuthSync();
  return <RouterProvider router={router} />;
}

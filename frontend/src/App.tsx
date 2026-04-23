import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { allRoutes } from "@/router";
import { PrivateRoute } from "@/router/private_route";
import { MainLayout } from "@/layouts/main_layout";
import { AuthLayout } from "@/layouts/auth_layout";
import "./app.css";

const layoutMap = {
  main: MainLayout,
  auth: AuthLayout,
  none: ({ children }: { children: React.ReactNode }) => <>{children}</>,
};

const router = createBrowserRouter(
  allRoutes.map(({ path, component: Component, layout = "main", auth = false }) => {
    const Layout = layoutMap[layout];

    const element = (
      <Layout>
        <Suspense fallback={<div className="page-loader">Loading…</div>}>
          {auth ? (
            <PrivateRoute>
              <Component />
            </PrivateRoute>
          ) : (
            <Component />
          )}
        </Suspense>
      </Layout>
    );

    return { path, element };
  })
);

export default function App() {
  return <RouterProvider router={router} />;
}

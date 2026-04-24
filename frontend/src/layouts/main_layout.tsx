import { AppSidebar } from "./app_sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      {children}
    </div>
  );
}

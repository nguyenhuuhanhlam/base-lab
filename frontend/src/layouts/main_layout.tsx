import { useState } from "react";
import { AppSidebar } from "./app_sidebar";
import { AppHeader } from "./app_header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { AppHeader } from "./app_header";
import { AppSidebar } from "./app_sidebar";
import "./layout.css";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-container">
      {/* Sidebar - Fixed Position */}
      <AppSidebar isOpen={sidebarOpen} />

      {/* Main Content Wrapper */}
      <div className={`app-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Top Header */}
        <AppHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="app-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

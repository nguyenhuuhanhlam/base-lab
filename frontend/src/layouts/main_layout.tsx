import { AppHeader } from "./app_header";
import { AppSidebar } from "./app_sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <AppHeader />

      {/* Body = Sidebar + Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AppSidebar />
        <main style={{ flex: 1, padding: "1rem", overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
];

type AppSidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export function AppSidebar({ isCollapsed, setIsCollapsed }: AppSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar: fixed on mobile, sticky on desktop */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen flex-shrink-0 flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed
            ? "-translate-x-full md:translate-x-0 w-64 md:w-16"
            : "translate-x-0 w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 shrink-0">
          <div className={`flex items-center gap-2.5 overflow-hidden ${
            isCollapsed ? "md:justify-center w-full" : ""
          }`}>
            <div className="w-7 h-7 shrink-0 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm">
              B
            </div>
            <span className={`text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "md:hidden" : ""
            }`}>
              BaseLab
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0 h-7 w-7"
            onClick={() => setIsCollapsed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Section label */}
        <div className={`px-4 mb-1 ${
          isCollapsed ? "md:px-0 md:flex md:justify-center" : ""
        }`}>
          <p className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider ${
            isCollapsed ? "md:hidden" : ""
          }`}>
            Overview
          </p>
          {isCollapsed && <div className="hidden md:block h-px w-6 bg-border" />}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 px-2 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${isCollapsed ? "md:justify-center md:px-0" : ""}`
              }
            >
              <Icon size={16} className="shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "md:hidden" : ""
              }`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

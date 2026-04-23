import { useAuthStore } from "@/store/auth_store";
import { Button } from "primereact/button";

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          onClick={onToggleSidebar} 
          className="sidebar-toggle"
        >
          <i className="pi pi-bars"></i>
        </button>
      </div>
      
      <div className="header-right">
        <Button 
          icon="pi pi-search" 
          rounded 
          text 
          size="small"
          aria-label="Search" 
        />
        <Button 
          icon="pi pi-bell" 
          rounded 
          text 
          size="small"
          aria-label="Notifications" 
        />
        <div className="header-divider"></div>
        <Button 
          icon="pi pi-sign-out" 
          rounded 
          text 
          size="small"
          onClick={logout} 
          aria-label="Logout" 
          tooltip="Logout"
          tooltipOptions={{ position: 'bottom' }}
        />
      </div>
    </header>
  );
}

import { NavLink } from "react-router-dom";

interface AppSidebarProps {
  isOpen: boolean;
}

export function AppSidebar({ isOpen }: AppSidebarProps) {
  return (
    <aside className={`app-sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-logo">
            <i className="pi pi-bolt"></i>
          </div>
          <span className="brand-name">Base Lab</span>
        </div>
      </div>
      
      <div className="sidebar-content custom-scrollbar">
        <ul className="sidebar-menu">
          <li className="menu-category">
            Favorites
          </li>
          <li className="menu-item">
            <NavLink 
              to="/" 
              className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            >
              <i className="pi pi-home"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li className="menu-category">
            Apps
          </li>
          <li className="menu-item">
            <NavLink 
              to="/products" 
              className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            >
              <i className="pi pi-box"></i>
              <span>Products</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

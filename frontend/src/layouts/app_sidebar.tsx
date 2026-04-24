import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "pi-home", label: "Dashboard" },
  { to: "/products", icon: "pi-box", label: "Products" },
];

export function AppSidebar() {
  return (
    <nav>
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 text-sm rounded-lg no-underline ${
              isActive ? "text-indigo-600 font-semibold" : "text-slate-600"
            }`
          }
        >
          <i className={`pi ${icon}`} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

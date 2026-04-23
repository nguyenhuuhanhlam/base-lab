import { Menubar } from "primereact/menubar";
import { useAuthStore } from "@/store/auth_store";
import { useNavigate } from "react-router-dom";

export function AppHeader() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", command: () => navigate("/") },
    { label: "Products",  command: () => navigate("/products") },
  ];

  const end = (
    <button onClick={logout} style={{ cursor: "pointer" }}>
      Logout
    </button>
  );

  return <Menubar model={items} end={end} />;
}

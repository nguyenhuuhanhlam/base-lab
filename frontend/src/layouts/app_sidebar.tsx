import { PanelMenu } from "primereact/panelmenu";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", command: () => {} },
      { label: "Products",  command: () => {} },
    ],
  },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Main",
      items: [
        { label: "Dashboard", command: () => navigate("/") },
        { label: "Products",  command: () => navigate("/products") },
      ],
    },
  ];

  return (
    <div style={{ width: "220px", borderRight: "1px solid #dee2e6", minHeight: "100%" }}>
      <PanelMenu model={items} style={{ width: "100%" }} />
    </div>
  );
}

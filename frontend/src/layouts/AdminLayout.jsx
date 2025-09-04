import { Outlet } from "react-router-dom";
import SidePanel from "../AdminPages/utils/SidePanel"; // adjust path if needed

function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <SidePanel />

      {/* Main content */}
      <div style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;

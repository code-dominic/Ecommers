import { useNavigate, useLocation } from "react-router-dom";

function SidePanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickRouteTo = (routeTo) => {
    navigate(`/dashboard/${routeTo}`);
  };

  const menuItems = [
    { label: "Users", route: "users" },
    { label: "Orders", route: "orders" },
    { label: "Returns", route: "returns" },       // ✅ typo fixed
    { label: "Cancellations", route: "cancellations" },
    { label: "Admins", route: "admins" },
    { label: "Sales", route: "sales" },
    { label: "Pick Ups", route: "pickups" },      // ✅ typo fixed
    { label: "Products", route: "products-list" },
    { label: "Add Products", route : "addproducts"},
  ];

  return (
    <div
      style={{
        backgroundColor: "#2f2f2f",
        color: "white",
        minHeight: "100vh",
        width: "220px",
        padding: "20px",
        boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>
        Dashboard
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === `/dashboard/${item.route}`;
          return (
            <li
              key={index}
              onClick={() => onClickRouteTo(item.route)}
              style={{
                padding: "12px 15px",
                margin: "8px 0",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.2s",
                background: isActive ? "#555" : "transparent", // ✅ active highlight
                fontWeight: isActive ? "bold" : "normal",
              }}
              onMouseOver={(e) =>
                !isActive && (e.currentTarget.style.background = "#444")
              }
              onMouseOut={(e) =>
                !isActive && (e.currentTarget.style.background = "transparent")
              }
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SidePanel;

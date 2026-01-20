import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSystemReset = () => {
    const confirmReset = window.confirm(
      "⚠ WARNING: This will ERASE ALL system data including customers, menu items, orders, and offers.\n\nThis action cannot be undone.\n\nDo you want to continue?"
    );

    if (!confirmReset) return;

    
    localStorage.removeItem("feastdelights_users");
    localStorage.removeItem("feastdelights_session");
    localStorage.removeItem("feastdelights_menu_items");
    localStorage.removeItem("feastdelights_orders");
    localStorage.removeItem("feastdelights_notifications");
    localStorage.removeItem("feastdelights_offers");
    sessionStorage.clear();

    
    logout();
    navigate("/login");

    setTimeout(() => {
      window.location.reload();
    }, 200); 
  };

  const menuLink =
    "block px-6 py-3 rounded-xl font-semibold text-lg text-[#f9f5f1] hover:bg-[#6b4f4f] transition";

  const activeMenuLink = "bg-[#6b4f4f]";

  return (
    <aside className="w-72 bg-[#4a2c2a] text-[#f9f5f1] min-h-screen p-6 shadow-xl">

      <h2 className="text-3xl font-serif font-bold mb-10">FeastDelights</h2>

      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/menu"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Menu Items
        </NavLink>

        <NavLink
          to="/admin/inventory"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Inventory
        </NavLink>

        <NavLink
          to="/admin/offers"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Offers
        </NavLink>

        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Customers
        </NavLink>

        <NavLink
          to="/admin/reviews"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Reviews
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `${menuLink} ${isActive ? activeMenuLink : ""}`
          }
        >
          Sales Reports
        </NavLink>
      </nav>

      {}
      <button
        onClick={handleLogout}
        className="mt-10 w-full py-3 bg-red-600 rounded-xl font-semibold hover:bg-red-700"
      >
        Logout
      </button>

      {}
      <button
        onClick={handleSystemReset}
        className="mt-4 w-full py-3 bg-[#d4a373] text-[#4a2c2a] rounded-xl font-semibold hover:bg-[#e1b98f]"
      >
        Reset System Data
      </button>
    </aside>
  );
}

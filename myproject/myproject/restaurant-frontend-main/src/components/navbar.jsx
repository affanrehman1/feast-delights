import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { notifications } = useContext(NotificationContext);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();            
    navigate("/login");  
  };

  return (
    <nav className="bg-[#4a2c2a] text-[#f9f5f1] shadow-md py-6 px-10 sticky top-0 z-40">
      <div className="w-full flex items-center justify-between">

        {}
        <Link
          to="/"
          className="text-3xl font-serif font-bold tracking-wide hover:text-[#d4a373] transition"
        >
          FeastDelights
        </Link>

        {}
        <div className="flex items-center gap-6 text-lg font-semibold">

          <Link
            to="/"
            className="hover:text-[#d4a373] transition"
          >
            Home
          </Link>

          <Link
            to="/menu"
            className="hover:text-[#d4a373] transition"
          >
            Menu
          </Link>

          {}
          {user && user.role === "customer" && (
            <>
              <Link
                to="/profile"
                className="hover:text-[#d4a373] transition"
              >
                Profile
              </Link>
              <Link
                to="/notifications"
                className="hover:text-[#d4a373] transition relative"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="hover:text-[#d4a373] transition relative"
              >
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {cart.length}
                  </span>
                )}
              </Link>
            </>
          )}

          {}
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="hover:text-[#d4a373] transition"
            >
              Admin Panel
            </Link>
          )}

          {}
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-[#d4a373] text-[#4a2c2a] rounded-full font-semibold hover:bg-[#b8865a] transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 border border-[#d4a373] rounded-full hover:bg-[#d4a373] hover:text-[#4a2c2a] transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

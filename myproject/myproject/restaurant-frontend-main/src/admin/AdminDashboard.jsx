import { useContext } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { OrdersContext } from "../context/OrdersContext";
import { MenuContext } from "../context/MenuContext";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { orders } = useContext(OrdersContext);
  const { menuItems } = useContext(MenuContext);
  const { users } = useContext(AuthContext);

  
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);
  const totalCustomers = users.filter((u) => u.role === "customer").length;
  const totalItems = menuItems.length;

  const recentOrders = orders.slice().reverse().slice(0, 5);

  return (
    <div className="flex bg-[#f7efe5] min-h-screen">
      {}
      <AdminSidebar />

      {}
      <div className="flex-1 p-10">
        <h1 className="text-5xl font-serif font-bold text-[#4a2c2a]">
          Admin Dashboard
        </h1>
        <p className="text-[#6b4f4f] mt-2 mb-10">
          Overview of restaurant activity and performance.
        </p>

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <KPI title="Total Orders" value={totalOrders} color="bg-[#4a2c2a]" />
          <KPI title="Total Revenue" value={`Rs ${totalRevenue}`} color="bg-[#d4a373]" />
          <KPI title="Customers" value={totalCustomers} color="bg-green-700" />
          <KPI title="Menu Items" value={totalItems} color="bg-[#6b4f4f]" />
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <QuickLink title="Manage Orders" link="/admin/orders" />
          <QuickLink title="Manage Menu" link="/admin/menu" />
          <QuickLink title="Inventory" link="/admin/inventory" />
          <QuickLink title="Offers" link="/admin/offers" />
          <QuickLink title="Customers" link="/admin/customers" />
          <QuickLink title="Sales Reports" link="/admin/reports" />
        </div>

        {}
        <motion.div
          className="bg-white p-8 rounded-3xl border border-[#efe7dd] shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-serif text-[#4a2c2a] font-bold mb-6">
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (
            <p className="text-[#6b4f4f]">No recent orders.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((o) => (
                <div
                  key={o.order_id}
                  className="flex justify-between items-center bg-[#f9f5f1] p-4 rounded-xl shadow-sm border border-[#efe7dd]"
                >
                  <div>
                    <p className="text-lg font-semibold text-[#4a2c2a]">
                      Order #{o.order_id}
                    </p>
                    <p className="text-sm text-[#6b4f4f]">
                      {o.items?.length || 0} items • Rs {o.total_amount}
                    </p>
                  </div>

                  <Link
                    to={`/admin/orders`}
                    className="text-[#4a2c2a] underline font-semibold hover:text-[#6b4f4f]"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function KPI({ title, value, color }) {
  return (
    <motion.div
      className={`rounded-3xl p-6 text-white text-center font-semibold shadow-lg ${color}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl">{title}</h3>
      <p className="text-4xl mt-2 font-bold">{value}</p>
    </motion.div>
  );
}

function QuickLink({ title, link }) {
  return (
    <motion.div
      className="bg-white border border-[#efe7dd] shadow-md rounded-3xl p-6 text-center hover:bg-[#f9f5f1] transition"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link to={link} className="text-2xl font-serif text-[#4a2c2a] font-bold">
        {title} →
      </Link>
    </motion.div>
  );
}

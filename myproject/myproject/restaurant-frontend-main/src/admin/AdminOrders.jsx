import { useContext, useState } from "react";
import { OrdersContext } from "../context/OrdersContext";
import AdminSidebar from "./components/AdminSidebar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useContext(OrdersContext);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchStatus = filter === "All" || order.status === filter;
    const matchSearch =
      order.order_id.toString().includes(search) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const statusOptions = ["All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

  const changeStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    
    alert(`Order #${orderId} updated to ${newStatus}`);
  };

  return (
    <div className="flex bg-[#f7efe5] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-serif font-bold text-[#4a2c2a]">Orders Management</h1>
        <p className="text-[#6b4f4f] mt-2 mb-10">View, filter, and manage all customer orders.</p>

        {}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-[#e5e7eb] p-3 rounded-xl shadow-sm"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by Order ID or Customer Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 border border-[#e5e7eb] p-3 rounded-xl shadow-sm"
          />
        </div>

        {}
        <div className="space-y-6">
          {filteredOrders.length === 0 && (
            <div className="text-center text-[#6b4f4f] text-lg mt-10">No orders found.</div>
          )}

          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.order_id}
              className="bg-white shadow-xl rounded-3xl p-8 border border-[#efe7dd]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h2 className="text-3xl font-serif font-bold text-[#4a2c2a]">Order #{order.order_id}</h2>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold mt-3 md:mt-0 ${order.status === "Delivered"
                    ? "bg-green-600 text-white"
                    : order.status === "Cancelled"
                      ? "bg-red-600 text-white"
                      : "bg-[#d4a373] text-[#4a2c2a]"
                    }`}
                >
                  {order.status}
                </span>
              </div>

              {}
              <p className="text-[#4a2c2a] text-lg font-semibold">{order.customer_name || "Guest"}</p>
              <p className="text-[#6b4f4f] text-sm mb-3">
                {order.order_date ? new Date(order.order_date).toLocaleString() : "-"}
              </p>

              {}
              <div className="mt-4">
                <p className="text-[#6b4f4f] font-medium mb-2">Items:</p>
                <ul className="ml-4 list-disc text-[#4a2c2a]">
                  {(order.items || []).slice(0, 3).map((item) => (
                    <li key={item.order_item_id ?? item.item_id ?? item.name}>
                      {item.quantity} × {item.name}
                    </li>
                  ))}
                </ul>

                {order.items && order.items.length > 3 && (
                  <p className="text-sm text-[#6b4f4f] mt-1">...and {order.items.length - 3} more</p>
                )}
              </div>

              {}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8">
                <p className="text-2xl font-bold text-[#4a2c2a]">Rs {order.total_amount}</p>

                <Link to={`/order/${order.order_id}`} className="text-[#4a2c2a] underline font-semibold hover:text-[#6b4f4f] mt-3 md:mt-0">
                  View Details →
                </Link>

                <select
                  value={order.status}
                  onChange={(e) => changeStatus(order.order_id, e.target.value)}
                  className="bg-[#f9f5f1] border border-[#e5e7eb] p-3 rounded-xl ml-0 md:ml-6 mt-4 md:mt-0"
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

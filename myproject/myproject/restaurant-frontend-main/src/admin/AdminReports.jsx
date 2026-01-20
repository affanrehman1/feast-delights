import { useContext } from "react";
import { OrdersContext } from "../context/OrdersContext";
import { MenuContext } from "../context/MenuContext";
import AdminSidebar from "./components/AdminSidebar";
import LineChartBox from "./components/LineChartBox";
import PieChartBox from "./components/PieChartBox";
import { motion } from "framer-motion";

export default function AdminReports() {
  const { orders } = useContext(OrdersContext);
  const { menuItems } = useContext(MenuContext);

  
  
  const validOrders = orders.filter((o) => o.status !== "Cancelled");

  const totalRevenue = validOrders.reduce((s, o) => s + o.total_amount, 0);
  const totalOrders = orders.length; 

  
  const revenueByDate = {};
  validOrders.forEach((o) => {
    const d = o.order_date.split("T")[0];
    revenueByDate[d] = (revenueByDate[d] || 0) + o.total_amount;
  });

  const lineData = Object.keys(revenueByDate).map((date) => ({
    date,
    revenue: revenueByDate[date],
  }));

  
  const categorySales = {};
  validOrders.forEach((order) => {
    order.items.forEach((i) => {
      const cat = i.category || "Other";
      categorySales[cat] = (categorySales[cat] || 0) + i.subtotal;
    });
  });

  const pieData = Object.keys(categorySales).map((cat) => ({
    name: cat,
    value: categorySales[cat],
  }));

  
  const itemCount = {};
  validOrders.forEach((order) => {
    order.items.forEach((i) => {
      itemCount[i.name] = (itemCount[i.name] || 0) + i.quantity;
    });
  });

  const bestSellers = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex bg-[#f7efe5] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-serif font-bold text-[#4a2c2a]">
          Sales Reports
        </h1>
        <p className="text-[#6b4f4f] mt-2 mb-10">
          View analytics, revenue trends, and performance insights.
        </p>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard title="Total Revenue" value={`Rs ${totalRevenue}`} color="bg-[#4a2c2a]" />
          <StatCard title="Total Orders" value={totalOrders} color="bg-[#d4a373]" />
          <StatCard title="Avg. Order Value" value={`Rs ${(totalRevenue / (totalOrders || 1)).toFixed(0)}`} color="bg-green-600" />
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <LineChartBox data={lineData} />

          <PieChartBox data={pieData} />
        </div>

        {}
        <motion.div
          className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-[#efe7dd]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-serif font-bold text-[#4a2c2a] mb-6">
            Best Selling Items
          </h2>

          {bestSellers.length === 0 ? (
            <p className="text-[#6b4f4f]">No sales data available.</p>
          ) : (
            <ul className="space-y-2">
              {bestSellers.map(([name, qty], i) => (
                <li key={i} className="text-lg text-[#4a2c2a]">
                  {i + 1}. {name} —
                  <span className="font-bold"> {qty} sold</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <motion.div
      className={`rounded-3xl p-6 text-white shadow-lg ${color}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}

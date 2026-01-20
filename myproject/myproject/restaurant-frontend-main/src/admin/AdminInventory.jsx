import { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext";
import AdminSidebar from "./components/AdminSidebar";
import { motion } from "framer-motion";

export default function AdminInventory() {
  const { menuItems, updateStock, updateItem } = useContext(MenuContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Fast Food", "Pizza", "Pasta", "Desserts"];

  const filtered = menuItems.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleStockChange = (id, value) => {
    const quantity = Number(value);
    if (quantity < 0) return;
    updateStock(id, quantity);
  };

  const toggleAvailability = (item) => {
    updateItem({ ...item, available: !item.available });
  };

  return (
    <div className="flex bg-[#f7efe5] min-h-screen">
      {}
      <AdminSidebar />

      {}
      <div className="flex-1 p-10">
        <h1 className="text-5xl font-serif font-bold text-[#4a2c2a]">
          Inventory Management
        </h1>
        <p className="text-[#6b4f4f] mt-2 mb-10">
          Track and manage stock levels for all menu items.
        </p>

        {}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-[#e5e7eb] bg-white rounded-xl"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border border-[#e5e7eb] rounded-xl w-full md:w-1/3 shadow-sm"
          />
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((item, index) => (
            <motion.div
              key={item.item_id}
              className="bg-white border border-[#efe7dd] shadow-md rounded-3xl p-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {}
              <h2 className="text-2xl font-serif font-bold text-[#4a2c2a]">
                {item.name}
              </h2>

              <p className="text-[#6b4f4f]">{item.category}</p>

              {}
              <p className="mt-4 text-lg font-semibold text-[#4a2c2a]">
                Stock:{" "}
                <span
                  className={`${item.stock_quantity <= 10
                      ? "text-red-600"
                      : "text-green-700"
                    }`}
                >
                  {item.stock_quantity}
                </span>
              </p>

              {}
              <div className="mt-2">
                <label className="text-sm text-[#6b4f4f]">Update Stock</label>
                <input
                  type="number"
                  min="0"
                  value={item.stock_quantity}
                  onChange={(e) =>
                    handleStockChange(item.item_id, e.target.value)
                  }
                  className="w-full p-3 mt-1 border rounded-xl bg-[#f9f5f1]"
                />
              </div>

              {}
              <div className="mt-5 flex justify-between items-center">
                <span
                  className={`font-bold ${item.available ? "text-green-700" : "text-red-600"
                    }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>

                <button
                  onClick={() => toggleAvailability(item)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md ${item.available
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  {item.available ? "Disable" : "Enable"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-lg text-[#6b4f4f] mt-10">
            No items match your filters.
          </p>
        )}
      </div>
    </div>
  );
}

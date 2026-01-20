import { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext";
import AdminSidebar from "./components/AdminSidebar";
import MenuFormModal from "./components/MenuFormModal";
import { motion } from "framer-motion";

export default function AdminMenu() {
  const { menuItems, addItem, updateItem, deleteItem, toggleAvailability } = useContext(MenuContext);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const categories = ["All", "Fast Food", "Pizza", "Pasta", "Desserts"];

  const filtered = menuItems.filter((item) => {
    const matchCategory = filter === "All" || item.category === filter;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex bg-[#f7efe5] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-serif font-bold text-[#4a2c2a]">Menu Management</h1>
        <p className="text-[#6b4f4f] mt-2 mb-8">Add, edit, delete and update menu items.</p>

        {}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-3 border border-[#e5e7eb] bg-white rounded-xl">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input type="text" placeholder="Search item..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 border border-[#e5e7eb] rounded-xl w-full md:w-1/3 shadow-sm" />

          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="bg-[#4a2c2a] text-[#f9f5f1] px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#6b4f4f]"
          >
            + Add New Item
          </button>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((item, index) => (
            <motion.div key={item.item_id} className="bg-white rounded-3xl shadow-xl p-5 border border-[#efe7dd]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              {}
              <img src={item.image_url || item.image || "/placeholder-food.jpg"} alt={item.name} className="w-full h-48 object-cover rounded-2xl" />

              {}
              <h2 className="text-2xl font-serif font-bold text-[#4a2c2a] mt-4">{item.name}</h2>
              <p className="text-[#6b4f4f]">{item.category}</p>

              <p className="text-xl font-bold text-[#4a2c2a] mt-2">Rs {item.price}</p>

              {}
              <p className="mt-2 text-sm text-[#4a2c2a]">
                Stock:{" "}
                <span className={`font-bold ${item.stock_quantity === 0 ? "text-red-600" : "text-green-700"}`}>{item.stock_quantity}</span>
              </p>

              <p className="text-sm mt-1">
                Status:{" "}
                <span className={`font-bold ${item.available ? "text-green-700" : "text-red-600"}`}>{item.available ? "Available" : "Unavailable"}</span>
              </p>

              {}
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setEditingItem(item); setModalOpen(true); }} className="flex-1 bg-[#d4a373] text-[#4a2c2a] py-2 rounded-full shadow hover:bg-[#e1b98f]">
                  Edit
                </button>

                <button onClick={() => { if (window.confirm("Delete this item?")) deleteItem(item.item_id); }} className="flex-1 bg-red-600 text-white py-2 rounded-full shadow hover:bg-red-700">
                  Delete
                </button>

                <button onClick={() => toggleAvailability(item.item_id)} className="flex-1 bg-[#4a2c2a] text-white py-2 rounded-full shadow hover:bg-[#6b4f4f]">
                  Toggle Availability
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {}
      {isModalOpen && (
        <MenuFormModal
          item={editingItem}
          close={() => setModalOpen(false)}
          save={(data) => {
            
            if (editingItem) updateItem({ ...data, item_id: editingItem.item_id ?? data.item_id });
            else addItem(data);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MenuFormModal({ item, close, save }) {
  const [form, setForm] = useState({
    item_id: null,
    name: "",
    category: "Fast Food",
    price: "",
    description: "",
    image_url: "",
    stock_quantity: 0,
    available: true,
  });

  useEffect(() => {
    if (item) {
      setForm({
        item_id: item.item_id ?? item.id,
        name: item.name || "",
        category: item.category || "Fast Food",
        price: item.price ?? "",
        description: item.description || "",
        image_url: item.image_url ?? item.image ?? "",
        stock_quantity: item.stock_quantity ?? 0,
        available: typeof item.available === "boolean" ? item.available : true,
      });
    }
  }, [item]);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setForm((p) => ({ ...p, [name]: checked }));
    else setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = () => {
    
    if (!form.name || form.price === "" || form.image_url === "") {
      alert("Please fill name, price and image URL.");
      return;
    }

    
    const payload = {
      ...form,
      price: Number(form.price),
      stock_quantity: Math.max(0, Number(form.stock_quantity) || 0),
      name: form.name.trim(),
      category: form.category.trim(),
      image_url: form.image_url.trim(),
      available: Boolean(form.available),
    };

    save(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <motion.div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-2xl font-serif font-bold text-[#4a2c2a] mb-4">{item ? "Edit Item" : "Add Menu Item"}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={update} placeholder="Item name" className="p-3 border rounded-xl bg-[#f9f5f1]" />
          <select name="category" value={form.category} onChange={update} className="p-3 border rounded-xl bg-[#f9f5f1]">
            <option>Fast Food</option>
            <option>Pizza</option>
            <option>Pasta</option>
            <option>Desserts</option>
          </select>

          <input name="price" value={form.price} onChange={update} placeholder="Price (numeric)" type="number" className="p-3 border rounded-xl bg-[#f9f5f1]" />
          <input name="stock_quantity" value={form.stock_quantity} onChange={update} placeholder="Stock quantity" type="number" className="p-3 border rounded-xl bg-[#f9f5f1]" />

          <input name="image_url" value={form.image_url} onChange={update} placeholder="Image URL (http... or /path )" className="p-3 border rounded-xl bg-[#f9f5f1] md:col-span-2" />
          <textarea name="description" value={form.description} onChange={update} placeholder="Description" className="p-3 border rounded-xl bg-[#f9f5f1] md:col-span-2" />
        </div>

        <div className="flex items-center gap-3 mt-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="available" checked={form.available} onChange={update} /> Available
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={close} className="px-6 py-2 bg-gray-300 rounded-full text-[#4a2c2a]">Cancel</button>
          <button onClick={submit} className="px-6 py-2 bg-[#4a2c2a] text-white rounded-full">{item ? "Save" : "Add Item"}</button>
        </div>
      </motion.div>
    </div>
  );
}

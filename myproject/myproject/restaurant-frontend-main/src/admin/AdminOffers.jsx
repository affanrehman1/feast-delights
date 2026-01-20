import { useContext, useState } from "react";
import { OfferContext } from "../context/OfferContext";
import AdminSidebar from "./components/AdminSidebar";
import OfferFormModal from "./components/OfferFormModal";
import { motion } from "framer-motion";

export default function AdminOffers() {
  const { offers, addOffer, updateOffer, deleteOffer } = useContext(OfferContext);

  const [search, setSearch] = useState("");
  const [editingOffer, setEditingOffer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  
  const filtered = offers.filter((off) => off.name.toLowerCase().includes(search.toLowerCase()));

  const today = new Date().toISOString().split("T")[0];

  const isActive = (offer) => offer.valid_from <= today && offer.valid_to >= today;

  return (
    <div className="flex bg-[#f7efe5] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-5xl font-serif font-bold text-[#4a2c2a]">Offers Management</h1>
        <p className="text-[#6b4f4f] mt-2 mb-10">Create and manage discount offers for customers.</p>

        {}
        <div className="flex justify-between items-center mb-10">
          <input type="text" placeholder="Search offers..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 border border-[#e5e7eb] rounded-xl shadow-sm w-1/3" />

          <button onClick={() => { setEditingOffer(null); setModalOpen(true); }} className="bg-[#4a2c2a] text-[#f9f5f1] px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#6b4f4f]">
            + Add Offer
          </button>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((off, index) => (
            <motion.div key={off.offer_id} className="bg-white border border-[#efe7dd] shadow-md rounded-3xl p-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <h2 className="text-2xl font-serif font-bold text-[#4a2c2a]">{off.name}</h2>
              <p className="text-[#6b4f4f] mt-2">{off.description}</p>

              <p className="mt-3 text-lg font-semibold text-[#4a2c2a]">{off.discount_percent}% OFF</p>

              <p className="mt-1 text-sm italic text-[#6b4f4f]">{off.valid_from} → {off.valid_to}</p>

              <p className={`mt-3 px-3 py-1 inline-block rounded-full text-sm font-bold ${isActive(off) ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                {isActive(off) ? "Active" : "Expired"}
              </p>

              {}
              <div className="flex gap-4 mt-6">
                <button onClick={() => { setEditingOffer(off); setModalOpen(true); }} className="flex-1 bg-[#d4a373] text-[#4a2c2a] py-2 rounded-full hover:bg-[#e1b98f]">Edit</button>

                <button onClick={() => { if (window.confirm("Delete this offer?")) deleteOffer(off.offer_id); }} className="flex-1 bg-red-600 text-white py-2 rounded-full hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {}
      {modalOpen && <OfferFormModal offer={editingOffer} close={() => setModalOpen(false)} save={(data) => { if (editingOffer) updateOffer(data); else addOffer(data); setModalOpen(false); }} />}
    </div>
  );
}

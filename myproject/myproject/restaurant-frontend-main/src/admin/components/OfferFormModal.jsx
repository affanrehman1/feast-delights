import { useState } from "react";
import { motion } from "framer-motion";

export default function OfferFormModal({ offer, close, save }) {
  const [form, setForm] = useState(
    offer
      ? {
        offer_id: offer.offer_id ?? offer.id,
        name: offer.name || "",
        discount_percent: offer.discount_percent ?? "",
        valid_from: offer.valid_from || "",
        valid_to: offer.valid_to || "",
        description: offer.description || "",
      }
      : {
        name: "",
        discount_percent: "",
        valid_from: "",
        valid_to: "",
        description: "",
      }
  );

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    if (!form.name || !form.discount_percent || !form.valid_from || !form.valid_to) {
      alert("Please fill all required fields.");
      return;
    }
    save(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-serif text-[#4a2c2a] font-bold mb-6">
          {offer ? "Edit Offer" : "Add New Offer"}
        </h2>

        {}
        <input
          name="name"
          value={form.name}
          onChange={update}
          placeholder="Offer Name"
          className="w-full border p-3 rounded-xl mb-3 bg-[#f9f5f1]"
        />

        <input
          type="number"
          name="discount_percent"
          value={form.discount_percent}
          onChange={update}
          placeholder="Discount % (0-100)"
          className="w-full border p-3 rounded-xl mb-3 bg-[#f9f5f1]"
        />

        <label className="text-[#4a2c2a] font-semibold mt-2">Valid From:</label>
        <input
          type="date"
          name="valid_from"
          value={form.valid_from}
          onChange={update}
          className="w-full border p-3 rounded-xl mb-3 bg-[#f9f5f1]"
        />

        <label className="text-[#4a2c2a] font-semibold mt-2">Valid To:</label>
        <input
          type="date"
          name="valid_to"
          value={form.valid_to}
          onChange={update}
          className="w-full border p-3 rounded-xl mb-3 bg-[#f9f5f1]"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={update}
          placeholder="Description"
          className="w-full border p-3 rounded-xl mb-3 bg-[#f9f5f1]"
        />

        {}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={close}
            className="px-6 py-2 bg-gray-300 rounded-full text-[#4a2c2a]"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-6 py-2 bg-[#4a2c2a] text-white rounded-full"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

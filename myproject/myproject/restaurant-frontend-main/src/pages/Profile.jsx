import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const { user, updateProfile, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveChanges = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      {}
      <motion.h1
        className="text-5xl font-serif font-bold text-[#4a2c2a]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Profile
      </motion.h1>

      <p className="text-[#6b4f4f] mt-2 mb-10">
        Manage your personal details and preferences.
      </p>

      {}
      <motion.div
        className="bg-white shadow-xl rounded-3xl p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 bg-[#d4a373] text-[#4a2c2a] rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
            {user.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-3xl font-serif font-bold text-[#4a2c2a]">
              {user.name}
            </h2>
            <p className="text-[#6b4f4f]">{user.email}</p>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[#4a2c2a]">

          <div>
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={updateForm}
              className="w-full bg-[#f9f5f1] border border-[#e5e7eb] p-3 rounded-xl mt-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateForm}
              className="w-full bg-[#f9f5f1] border border-[#e5e7eb] p-3 rounded-xl mt-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={updateForm}
              className="w-full bg-[#f9f5f1] border border-[#e5e7eb] p-3 rounded-xl mt-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={updateForm}
              rows="2"
              className="w-full bg-[#f9f5f1] border border-[#e5e7eb] p-3 rounded-xl mt-1 resize-none focus:outline-none"
            ></textarea>
          </div>
        </div>

        {}
        <button
          onClick={saveChanges}
          className="
            mt-10 
            w-full 
            bg-[#4a2c2a] 
            text-[#f9f5f1] 
            py-4 
            rounded-full 
            font-semibold 
            text-xl 
            hover:bg-[#6b4f4f] 
            shadow-md 
            hover:shadow-lg 
            transition
          "
        >
          Save Changes
        </button>

        {saved && (
          <div className="text-green-700 text-center mt-4">
            ✓ Profile updated successfully!
          </div>
        )}

        {}
        <div className="text-center mt-8">
          <Link
            to="/orders"
            className="text-[#4a2c2a] underline font-semibold hover:text-[#6b4f4f] transition"
          >
            View Order History →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

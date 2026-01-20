import { useContext } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function AdminCustomers() {
  const { users, toggleUserStatus } = useContext(AuthContext);

  
  const customers = users.filter((u) => u.role === "customer");

  return (
    <div className="flex bg-[#f7efe5] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-4xl font-serif font-bold text-[#4a2c2a]">
          Customers
        </h1>
        <p className="text-[#6b4f4f] mb-8">View and manage customer accounts.</p>

        {customers.length === 0 ? (
          <p className="text-[#6b4f4f] text-lg">No customers registered yet.</p>
        ) : (
          <motion.div
            className="bg-white shadow-lg border border-[#eee2d9] rounded-3xl p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#4a2c2a] text-white text-left">
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Joined Date</th>

                </tr>
              </thead>

              <tbody>
                {customers.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b ${i % 2 === 0 ? "bg-[#fdf7f2]" : "bg-[#f9f1ea]"
                      }`}
                  >
                    <td className="p-4 text-[#6b4f4f] font-mono text-sm">{c.id}</td>
                    <td className="p-4 font-semibold text-[#4a2c2a]">{c.name}</td>
                    <td className="p-4 text-[#6b4f4f]">{c.email}</td>
                    <td className="p-4 text-[#6b4f4f]">{c.phone}</td>
                    <td className="p-4 text-[#6b4f4f]">{c.address}</td>
                    <td className="p-4 text-[#6b4f4f]">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : "N/A"}
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}

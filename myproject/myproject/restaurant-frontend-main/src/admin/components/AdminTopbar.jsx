import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminTopBar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full bg-white p-4 shadow-md border-b border-[#efe7dd] flex justify-between items-center">
      <h2 className="text-2xl font-serif font-bold text-[#4a2c2a]">
        Welcome, {user?.name || "Admin"}
      </h2>

      <div className="text-[#6b4f4f] font-semibold">
        Role: <span className="text-[#4a2c2a]">{user?.role}</span>
      </div>
    </div>
  );
}

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email.trim(), password.trim());

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    
    if (result.role === "admin") navigate("/admin/dashboard");
    else navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7efe5] px-4">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-[#efe7dd]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-serif font-bold text-[#4a2c2a] text-center">
          Welcome Back
        </h1>
        <p className="text-center text-[#6b4f4f] mb-8">
          “Your Comfort Food Destination”
        </p>

        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mb-4 rounded-xl border border-[#e5e7eb] bg-[#f9f5f1]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 mb-6 rounded-xl border border-[#e5e7eb] bg-[#f9f5f1]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#4a2c2a] text-[#f9f5f1] py-3 rounded-full font-semibold text-lg shadow-md hover:bg-[#6b4f4f] transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-[#6b4f4f]">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

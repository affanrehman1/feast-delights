import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  
  const validateForm = () => {
    if (name.trim().length < 3) return "Name must be at least 3 characters.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Enter a valid email address.";

    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(phone.trim()))
      return "Phone must be 11 digits (e.g., 03001234567).";

    if (address.trim().length < 5)
      return "Address must be at least 5 characters.";

    if (password.length < 6)
      return "Password must be at least 6 characters.";

    if (password !== confirmPassword)
      return "Passwords do not match.";

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      
      const result = await register({
        name,
        email,
        phone,
        address,
        password,
      });

      if (!result.success) {
        setError(result.error || "Failed to register.");
        return;
      }

      navigate("/");
    } catch (err) {
      setError("Internal error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7efe5] px-4">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-[#efe7dd]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-serif font-bold text-[#4a2c2a] text-center">
          Create Account
        </h1>
        <p className="text-center text-[#6b4f4f] mb-8">
          Join FeastDelights Today
        </p>

        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded-xl mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          {}
          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full p-3 mb-4 rounded-xl border bg-[#f9f5f1]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {}
          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Your email"
            className="w-full p-3 mb-4 rounded-xl border bg-[#f9f5f1]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {}
          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="03001234567"
            className="w-full p-3 mb-4 rounded-xl border bg-[#f9f5f1]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {}
          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Address
          </label>
          <textarea
            placeholder="Enter your full address"
            className="w-full p-3 mb-4 rounded-xl border bg-[#f9f5f1]"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>

          {}
          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Password
          </label>
          <input
            type="password"
            placeholder="Choose a password"
            className="w-full p-3 mb-4 rounded-xl border bg-[#f9f5f1]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {}
          <label className="block mb-1 font-semibold text-[#4a2c2a]">
            Re-enter Password
          </label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className="w-full p-3 mb-6 rounded-xl border bg-[#f9f5f1]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-[#4a2c2a] text-[#f9f5f1] py-3 rounded-full font-semibold text-lg shadow-md hover:bg-[#6b4f4f]"
          >
            Sign Up →
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-[#6b4f4f]">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

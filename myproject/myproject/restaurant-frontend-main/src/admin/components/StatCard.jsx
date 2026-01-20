import { motion } from "framer-motion";

export default function StatCard({ title, value, color }) {
  return (
    <motion.div
      className={`rounded-3xl p-6 text-white text-center font-semibold shadow-lg ${color}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl">{title}</h3>
      <p className="text-4xl mt-2 font-bold">{value}</p>
    </motion.div>
  );
}

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function LineChartBox({ data }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#efe7dd] h-[380px]">
      <h2 className="text-2xl font-serif font-bold text-[#4a2c2a] mb-4">
        Revenue Trend
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b4f4f" />
          <YAxis stroke="#6b4f4f" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4a2c2a"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#4a2c2a", "#d4a373", "#6b4f4f", "#8d6e63", "#bcaaa4"];

export default function PieChartBox({ data }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#efe7dd] h-[380px]">
      <h2 className="text-2xl font-serif font-bold text-[#4a2c2a] mb-4">
        Category-wise Sales
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `Rs ${value}`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

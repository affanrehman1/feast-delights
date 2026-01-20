export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-full border text-sm font-semibold transition ${
            active === cat
              ? "bg-red-700 text-white border-red-700"
              : "border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

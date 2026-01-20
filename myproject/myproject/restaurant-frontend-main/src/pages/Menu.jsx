import { useState, useContext, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuContext } from "../context/MenuContext";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import ItemCard from "../components/ItemCard";

export default function Menu() {
  const { menuItems } = useContext(MenuContext);

  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  
  const categories = useMemo(() => ["All", ...new Set(menuItems.map((i) => i.category))], [menuItems]);

  
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        search.trim() === "" || item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, search]);




  return (
    <div className="max-w-7xl mx-auto px-4 mt-14 mb-20">
      {}
      <motion.h1
        className="text-5xl font-serif font-bold text-[#4a2c2a]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Explore Our Menu
      </motion.h1>

      <p className="text-[#6b4f4f] mt-2 mb-10">
        Comfort food crafted with passion.
      </p>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-10 relative">
        <div className="relative w-full">
          {}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search items..."
            className="p-3 pl-10 w-full bg-white border border-[#e5e7eb] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373] transition"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              setSelectedItem(null); 

              if (value.length > 0) {
                const s = menuItems.filter((item) => {
                  
                  const matchesCategory = activeCategory === "All" || item.category === activeCategory;
                  const matchesSearch = item.name.toLowerCase().includes(value.toLowerCase());
                  return matchesCategory && matchesSearch;
                });
                setSuggestions(s.slice(0, 5));
              } else {
                setSuggestions([]);
              }
            }}
          />

          {suggestions.length > 0 && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-lg absolute mt-1 w-full z-50 overflow-hidden">
              {suggestions.map((item) => {
                
                const parts = item.name.split(new RegExp(`(${search})`, "gi"));
                return (
                  <div
                    key={item.item_id}
                    onClick={() => {
                      setActiveCategory(item.category);
                      setSuggestions([]);
                      setSelectedItem(item);
                    }}
                    className="p-3 cursor-pointer hover:bg-[#f9f5f1] transition text-[#4a2c2a]"
                  >
                    {parts.map((part, index) =>
                      part.toLowerCase() === search.toLowerCase() ? (
                        <span key={index} className="font-bold bg-yellow-100 text-[#d4a373]">
                          {part}
                        </span>
                      ) : (
                        <span key={index}>{part}</span>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>




        <div className="col-span-2 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);       
                setSuggestions([]);           
                setSelectedItem(null);        
                
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${activeCategory === cat
                ? "bg-[#d4a373] text-[#4a2c2a] shadow"
                : "bg-white border border-[#e5e7eb] text-[#6b4f4f] hover:bg-[#f9f5f1]"
                }`}
            >
              {cat}
            </button>
          ))}

        </div>
      </div>

      {}
      {selectedItem && (
        <motion.div
          key={selectedItem.item_id}
          className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-64 h-64 relative mb-4">
            <img
              src={selectedItem.image_url}
              alt={selectedItem.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <h2 className="text-xl font-semibold text-[#4a2c2a] mb-2">
            {selectedItem.name}
          </h2>
          <p className="text-[#6b4f4f] text-sm mb-3">{selectedItem.description}</p>
          <p className="text-lg font-bold text-[#4a2c2a] mb-3">
            Rs {selectedItem.price.toLocaleString()}
          </p>

          {}
          <button
            onClick={() => addToCart(selectedItem)}
            className="mt-2 w-48 bg-[#d4a373] text-[#4a2c2a] py-1 rounded-full font-semibold hover:bg-[#e1b98f] transition"
          >
            Add to Cart
          </button>
        </motion.div>
      )}

      {}
      <motion.div
        key={activeCategory} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <motion.div
              key={item.item_id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <ItemCard item={item} />
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-[#6b4f4f] text-lg">
            No items match your search.
          </p>
        )}
      </motion.div>
    </div >
  );
}

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MenuContext } from "../context/MenuContext";

export default function Home() {
  const [hoveredSpecial, setHoveredSpecial] = useState(null);

  const { menuItems } = useContext(MenuContext);
  const navigate = useNavigate();

  
  const specials = menuItems.slice(0, 3);

  const categories = [
    { name: "Fast Food", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh6RK9tPsOgchnqym5plWR5hWOImw_OV3vew&s" },
    { name: "Pizza", image: "https://images.pexels.com/photos/19130186/pexels-photo-19130186/free-photo-of-top-view-of-pizzas-with-different-toppings.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Pasta", image: "https://www.allrecipes.com/thmb/qKBkAjWqJY1SbHodpPP-lfkO554=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1228681870-2000-eece91bc1bdf4d0aa9fbcf992755cd67.jpg" },
    { name: "Desserts", image: "https://t3.ftcdn.net/jpg/01/76/33/14/360_F_176331484_nLHY9EoW0ETwPZaS9OBXPGbCJhT70GZe.jpg" },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate("/menu", { state: { category: categoryName } });
  };

  return (
    <div className="mt-6">

      {}
      <section className="relative h-[550px] rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1551218808-94e220e084d2"
          alt="FeastDelights Premium Food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#f9f5f1] px-4">
          <motion.h1
            className="text-6xl font-serif font-extrabold drop-shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            FeastDelights
          </motion.h1>
          <motion.p
            className="text-2xl italic mt-4 text-[#d4a373]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            “Your Comfort Food Destination”
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <Link
              to="/menu"
              className="mt-8 inline-block bg-[#d4a373] text-[#4a2c2a] px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-[#e1b98f] transition"
            >
              Explore Menu →
            </Link>
          </motion.div>
        </div>
      </section>

      {}
      <section className="mt-24">
        <h2 className="text-4xl font-serif font-bold text-[#4a2c2a] text-center">
          Explore Our Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-12 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              className="rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              whileHover={{ scale: 1.04 }}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-32 object-cover"
              />
              <div className="py-3 text-center font-semibold text-[#4a2c2a]">
                {cat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </section>



      {}
      <section className="mt-24 bg-[#f9f5f1] py-16 rounded-3xl shadow-inner px-4">
        <h2 className="text-4xl font-serif font-bold text-center text-[#4a2c2a]">
          Chef’s Specials
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 max-w-6xl mx-auto">
          {specials.length === 0 ? (
            <p className="text-center text-[#6b4f4f] col-span-3">
              Loading specials...
            </p>
          ) : (
            specials.map((dish) => (
              <motion.div
                key={dish.item_id}
                className="relative rounded-3xl bg-white overflow-hidden shadow-lg hover:shadow-2xl transition group"
                whileHover={{ scale: 1.03 }}
                onMouseEnter={() => setHoveredSpecial(dish.item_id)}
                onMouseLeave={() => setHoveredSpecial(null)}
              >
                <div className="relative h-56 w-full">
                  <img
                    src={dish.image_url || "https://via.placeholder.com/300"}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />

                  {}
                  {hoveredSpecial === dish.item_id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 text-center"
                    >
                      <p className="text-white text-lg font-medium">
                        {dish.description || "A delicious special just for you!"}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-serif font-semibold text-[#4a2c2a]">
                    {dish.name}
                  </h3>
                  <p className="text-[#6b4f4f] font-bold text-xl mt-2">
                    Rs {dish.price}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {}
      <section className="mt-24 mb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.img
            src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa"
            alt="About FeastDelights"
            className="rounded-3xl shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-4xl font-serif font-bold text-[#4a2c2a] mb-4">
              Why FeastDelights?
            </h2>
            <p className="text-lg text-[#6b4f4f] leading-7">
              At FeastDelights, we elevate comfort food into an art.
              Fresh ingredients, handcrafted recipes, and passion in every bite.
            </p>

            <ul className="mt-6 space-y-3 text-lg text-[#4a2c2a]">
              <li>✓ Fresh, premium ingredients</li>
              <li>✓ Hygienic & safe kitchen</li>
              <li>✓ Fast delivery system</li>
              <li>✓ Chef-crafted special recipes</li>
            </ul>

            <Link
              to="/menu"
              className="mt-8 inline-block bg-[#4a2c2a] text-[#f9f5f1] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#6b4f4f] transition"
            >
              Discover Menu →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

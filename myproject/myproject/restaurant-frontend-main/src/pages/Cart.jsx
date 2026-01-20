import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { MenuContext } from "../context/MenuContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalAmount,
  } = useContext(CartContext); 

  const { menuItems } = useContext(MenuContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToCheckout = () => {
    if (!user) {
      alert("Please login before checkout.");
      navigate("/login");
      return;
    }
    navigate("/place-order");
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-center">
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/562/562678.png"
          alt="Empty Cart"
          className="w-40 opacity-70"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />

        <h2 className="text-4xl font-serif font-bold text-[#4a2c2a] mt-6">
          Your cart is empty
        </h2>
        <p className="text-[#6b4f4f] mt-2 text-lg">
          Looks like you haven’t added anything yet.
        </p>

        <Link
          to="/menu"
          className="mt-8 bg-[#d4a373] text-[#4a2c2a] px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-[#e1b98f]"
        >
          Browse Menu →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <motion.h1
        className="text-5xl font-serif font-bold text-[#4a2c2a]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Cart
      </motion.h1>

      <p className="text-[#6b4f4f] mt-2 mb-10">Review your selections.</p>

      <div className="space-y-6">
        {cart.map((item) => {
          const menuItem = menuItems.find((m) => m.item_id === item.item_id);
          const maxStock = menuItem ? menuItem.stock_quantity : item.stock_quantity;

          return (
            <motion.div
              key={item.item_id}
              className="flex flex-col md:flex-row bg-white rounded-3xl shadow-md p-4 gap-4 border border-[#efe7dd]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full md:w-40 h-40 object-cover rounded-2xl"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#4a2c2a]">
                    {item.name}
                  </h2>
                  <p className="text-[#6b4f4f]">{item.category}</p>

                  <p className="text-xl font-bold text-[#4a2c2a] mt-3">
                    Rs {item.price}
                  </p>

                  {}
                  {maxStock <= 3 && (
                    <p className="text-red-600 font-semibold text-sm mt-1">
                      Only {maxStock} left!
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {}
                  <button
                    onClick={() => decreaseQty(item.item_id)}
                    className="w-10 h-10 rounded-full bg-[#f1e4d4] text-[#4a2c2a] text-xl font-bold hover:bg-[#e6d5c4]"
                  >
                    –
                  </button>

                  <span className="text-xl font-semibold text-[#4a2c2a]">
                    {item.quantity}
                  </span>

                  {}
                  <button
                    onClick={() => increaseQty(item.item_id)}
                    disabled={item.quantity >= maxStock}
                    className={`w-10 h-10 rounded-full text-xl font-bold ${item.quantity >= maxStock
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-[#d4a373] text-[#4a2c2a] hover:bg-[#e1b98f]"
                      }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {}
              <button
                onClick={() => removeFromCart(item.item_id)}
                className="self-start text-[#6b4f4f] hover:text-red-600 text-sm underline"
              >
                Remove
              </button>
            </motion.div>
          );
        })}
      </div>

      {}
      <motion.div
        className="mt-12 bg-white p-6 rounded-3xl shadow-xl max-w-md ml-auto border border-[#efe7dd]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-2xl font-serif font-bold text-[#4a2c2a]">
          Order Summary
        </h2>

        <div className="flex justify-between mt-6 text-lg text-[#4a2c2a]">
          <span>Subtotal</span>
          <span>Rs {totalAmount}</span>
        </div>

        <button
          onClick={goToCheckout}
          className="mt-8 w-full bg-[#4a2c2a] text-[#f9f5f1] py-3 rounded-full font-semibold text-lg hover:bg-[#6b4f4f]"
        >
          Proceed to Checkout →
        </button>
      </motion.div>
    </div>
  );
}

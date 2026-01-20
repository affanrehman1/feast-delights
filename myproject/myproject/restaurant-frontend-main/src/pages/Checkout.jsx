import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { OrdersContext } from "../context/OrdersContext";
import { OfferContext } from "../context/OfferContext";
import { MenuContext } from "../context/MenuContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user, isLoading } = useContext(AuthContext);
  const { createOrder } = useContext(OrdersContext);
  const { offers } = useContext(OfferContext);
  const { menuItems } = useContext(MenuContext);

  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null);

  
  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [user, isLoading, navigate]);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  
  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  
  const applyCoupon = () => {
    const offer = offers.find(
      (o) => o.name.toLowerCase() === coupon.toLowerCase()
    );

    if (!offer) {
      alert("Invalid coupon code!");
      return;
    }

    setAppliedOffer(offer);
  };

  
  const placeOrder = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    
    for (let cItem of cart) {
      const menuItem = menuItems.find((m) => m.item_id === cItem.item_id);

      if (!menuItem) {
        alert(`Item ${cItem.name} no longer exists.`);
        return;
      }

      if (cItem.quantity > menuItem.stock_quantity) {
        alert(
          `Cannot place order!\n\n` +
          `${cItem.name} has only ${menuItem.stock_quantity} in stock,\n` +
          `but you ordered ${cItem.quantity}.`
        );
        return;
      }
    }

    
    const order = createOrder({
      customer: user,
      cartItems: cart,
      deliveryInfo: { name: user.name },
      offer: appliedOffer,
      paymentMethod: "Card",
    });

    clearCart();
    navigate(`/order/${order.order_id}`);
  };

  const discount = appliedOffer
    ? (subtotal * appliedOffer.discount_percent) / 100
    : 0;

  const total = subtotal - discount;

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <motion.h1
        className="text-4xl font-serif font-bold text-[#4a2c2a] mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Checkout
      </motion.h1>

      {}
      <div className="bg-white p-6 rounded-3xl shadow border mb-8">
        {cart.map((i) => (
          <div
            className="flex justify-between py-2 text-[#4a2c2a]"
            key={i.item_id}
          >
            <span>
              {i.name} ({i.quantity})
            </span>
            <span>Rs {i.price * i.quantity}</span>
          </div>
        ))}
      </div>

      {}
      <div className="bg-white p-6 rounded-3xl shadow border mb-8">
        <div className="flex gap-3">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 p-3 border rounded-xl bg-[#f9f5f1]"
          />
          <button
            onClick={applyCoupon}
            className="px-4 py-2 bg-[#4a2c2a] text-white rounded-xl"
          >
            Apply
          </button>
        </div>

        {appliedOffer && (
          <p className="text-green-700 font-semibold mt-2">
            Applied: {appliedOffer.name} ({appliedOffer.discount_percent}% OFF)
          </p>
        )}
      </div>

      {}
      <div className="bg-white p-6 rounded-3xl shadow border mb-8">
        <p className="text-lg text-[#4a2c2a]">Subtotal: Rs {subtotal}</p>
        <p className="text-lg text-[#4a2c2a]">
          Discount: Rs {discount.toFixed(0)}
        </p>

        <h2 className="text-2xl font-bold text-[#4a2c2a] mt-4">
          Total: Rs {total.toFixed(0)}
        </h2>
      </div>

      {}
      <button
        onClick={placeOrder}
        className="w-full py-4 bg-[#4a2c2a] text-white rounded-2xl text-xl hover:bg-[#6b4f4f] transition"
      >
        Place Order →
      </button>
    </div>
  );
}

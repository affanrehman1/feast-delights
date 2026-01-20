import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { NotificationContext } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";
import { OrdersContext } from "../context/OrdersContext";
import { supabase } from "../supabaseClient";

export default function ItemCard({ item }) {
  const { addToCart } = useContext(CartContext);
  const { pushNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const { orders } = useContext(OrdersContext);

  const [reviews, setReviews] = useState([]);

  
  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from("review")
        .select("*")
        .eq("item_id", item.item_id);
      if (data) setReviews(data);
    }
    fetchReviews();
  }, [item.item_id]);

  const avg =
    reviews.length > 0
      ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1)
      : null;

  const isOutOfStock = !item.available || item.stock_quantity <= 0;

  
  const userHasPurchasedItem = () => {
    if (!user) return false;
    return orders.some(
      (order) =>
        order.customer_id === user.id &&
        order.items.some((i) => i.item_id === item.item_id) 
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
    );
  };

  
  
  
  
  

  const addReview = async () => {
    if (!user) {
      alert("Please login to review items.");
      return;
    }

    
    

    
    

    const hasPurchased = orders.some((order) =>
      order.customer_id === user.id &&
      order.status === "Delivered" && 
      order.items.some((i) => {
        
        return i.item_id === item.item_id || (i.menu_item && i.menu_item.item_id === item.item_id);
      })
    );

    if (!hasPurchased) {
      alert("You can only review items from orders that have been DELIVERED.");
      return;
    }

    const rating = Number(prompt("Rate this item (1–5):"));
    if (!rating || rating < 1 || rating > 5) {
      alert("Invalid rating");
      return;
    }

    const comment = prompt("Write a short review") || "";

    try {
      const { error } = await supabase.from("review").insert([
        {
          item_id: item.item_id,
          customer_id: user.id,
          rating,
          comment,
        },
      ]);

      if (error) throw error;

      pushNotification({
        message: `Review added for ${item.name}`,
        type: "success",
      });

      
      const { data } = await supabase
        .from("review")
        .select("*")
        .eq("item_id", item.item_id);
      if (data) setReviews(data);

    } catch (err) {
      console.error("Error adding review:", err);
      alert(`Failed to submit review: ${err.message || err.details || JSON.stringify(err)}`);
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl shadow-md overflow-hidden transition duration-300 hover:shadow-2xl hover:-translate-y-1 relative ${isOutOfStock ? "opacity-60 grayscale" : ""
        }`}
    >
      {}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
          Out of Stock
        </div>
      )}

      <img
        src={item.image_url}
        alt={item.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">
        {}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-serif font-bold text-[#4a2c2a]">
            {item.name}
          </h2>

          {avg ? (
            <span className="bg-[#d4a373] text-[#4a2c2a] px-3 py-1 rounded-full text-sm font-semibold">
              {avg} ★
            </span>
          ) : (
            <span className="text-gray-400 text-sm">No reviews</span>
          )}
        </div>

        <p className="text-[#6b4f4f] text-sm mb-3">{item.category}</p>

        <p className="text-2xl font-bold text-[#4a2c2a]">
          Rs {item.price}
        </p>

        {}
        {item.stock_quantity <= 3 && item.stock_quantity > 0 && (
          <p className="text-red-600 mt-1 text-sm font-semibold">
            Only {item.stock_quantity} left!
          </p>
        )}

        {}
        <div className="flex gap-3 mt-5">
          {}
          <button
            onClick={() =>
              isOutOfStock
                ? alert("Item is out of stock.")
                : addToCart(item)
            }
            disabled={isOutOfStock}
            className={`flex-1 py-3 rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition ${isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#4a2c2a] text-[#f9f5f1] hover:bg-[#6b4f4f]"
              }`}
          >
            Add to Cart
          </button>

          {}
          <button
            onClick={addReview}
            
            className={`px-5 py-3 rounded-full font-semibold border transition ${true 
              ? "border-[#4a2c2a] text-[#4a2c2a] hover:bg-[#f9f5f1]"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}

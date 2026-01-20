import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

export default function OrderHistory() {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (isLoading) return; 

    if (!user) {
      alert("Please login to view your order history.");
      navigate("/login");
      return;
    }

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from("order_header")
          .select(`
            *,
            items:order_item (
              order_item_id,
              quantity,
              price_at_order,
              menu_item:item_id (name)
            )
          `)
          .eq("customer_id", user.id)
          .order("order_date", { ascending: false });

        if (error) throw error;
        setMyOrders(data || []);
      } catch (err) {
        console.error("Error fetching order history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#4a2c2a] text-xl font-serif">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">

      {}
      <motion.h1
        className="text-5xl font-serif font-bold text-[#4a2c2a]"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Orders
      </motion.h1>

      <p className="text-[#6b4f4f] mt-2 mb-10">
        View your past orders and track their status.
      </p>

      {}
      {myOrders.length === 0 && (
        <div className="text-center mt-20 text-[#6b4f4f] text-xl">
          You haven't placed any orders yet.
          <br />
          <Link
            to="/menu"
            className="block mt-6 text-[#4a2c2a] underline font-semibold text-lg"
          >
            Order Something Delicious →
          </Link>
        </div>
      )}

      {}
      <div className="space-y-8">
        {myOrders.map((order, index) => (
          <motion.div
            key={order.order_id}
            className="
              bg-white shadow-xl rounded-3xl p-7 
              flex flex-col md:flex-row justify-between items-start gap-6
              border border-[#efe7dd]
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {}
            <div className="flex-1">
              <h2 className="text-2xl font-serif font-bold text-[#4a2c2a]">
                Order #{order.order_id}
              </h2>

              <p className="text-[#6b4f4f] mt-1">
                Placed on:{" "}
                <span className="font-semibold">
                  {new Date(order.order_date).toLocaleString()}
                </span>
              </p>

              <p className="text-[#6b4f4f] mt-1">
                {order.items.length} items •{" "}
                <span className="font-semibold text-[#4a2c2a]">
                  Rs {order.total_amount}
                </span>
              </p>

              <div className="mt-4">
                <span
                  className={`
                    px-4 py-1 rounded-full text-sm font-semibold
                    ${order.status === "Delivered"
                      ? "bg-green-600 text-white"
                      : order.status === "Cancelled"
                        ? "bg-red-600 text-white"
                        : "bg-[#d4a373] text-[#4a2c2a]"
                    }
                  `}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {}
            <div className="self-end md:self-center">
              <Link
                to={`/order/${order.order_id}`}
                className="
                  bg-[#4a2c2a] 
                  text-[#f9f5f1] 
                  px-6 py-3 
                  rounded-full 
                  font-semibold 
                  hover:bg-[#6b4f4f] 
                  shadow-md 
                  hover:shadow-lg 
                  transition
                "
              >
                View Details →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

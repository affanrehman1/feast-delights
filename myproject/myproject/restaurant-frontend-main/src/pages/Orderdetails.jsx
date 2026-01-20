import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { OrdersContext } from "../context/OrdersContext";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { updateOrderStatus } = useContext(OrdersContext);
  const { user, isLoading } = useContext(AuthContext);
  const { pushNotification } = useContext(NotificationContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!isLoading && !user) {
      alert("Please login to view order details.");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  
  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from("order_header")
          .select(`
            *,
            customer:customer_id (name),
            payment:payment_id (*),
            items:order_item (
              order_item_id,
              quantity,
              price_at_order,
              menu_item:item_id (name)
            )
          `)
          .eq("order_id", id)
          .single();

        if (error) throw error;

        if (data) {
          
          const formatted = {
            order_id: data.order_id,
            status: data.status,
            total_amount: data.total_amount,
            payment: data.payment,
            items: data.items.map((i) => ({
              order_item_id: i.order_item_id,
              item_id: i.menu_item?.item_id || i.item_id, 
              name: i.menu_item?.name || "Unknown",
              quantity: i.quantity,
              price_at_order: i.price_at_order,
              subtotal: i.quantity * i.price_at_order,
            })),
          };
          setOrder(formatted);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  if (isLoading) return <div className="mt-20 text-center text-[#6b4f4f]">Loading...</div>;

  if (loading) {
    return <div className="mt-20 text-center text-[#6b4f4f]">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="mt-20 text-center text-[#6b4f4f] text-xl">
        Order not found.
      </div>
    );
  }

  const steps = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
  const statusIndex = steps.indexOf(order.status);

  
  const handleCancelOrder = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? Refund will be processed automatically."
    );

    if (!confirmCancel) return;

    
    console.log("[OrderDetails] Cancelling order with items:", order.items);
    updateOrderStatus(order.order_id, "Cancelled", order.items);

    
    setOrder(prev => ({ ...prev, status: "Cancelled" }));

    
    

    
    pushNotification({
      type: null,
      message: `Your order #${order.order_id} has been cancelled.`,
      order_id: order.order_id,
    });

    alert("Your order has been cancelled.");
  };

  const canCancel = order.status === "Pending";

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">

      {}
      <motion.h1
        className="text-5xl font-serif font-bold text-[#4a2c2a] mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Order #{order.order_id}
      </motion.h1>

      <p className="text-[#6b4f4f] mb-10">
        Track your order’s progress in real-time.
      </p>

      {}
      <div className="mb-6 flex items-center gap-4">
        <span
          className={`
            px-5 py-2 rounded-full text-white font-semibold
            ${order.status === "Delivered"
              ? "bg-green-600"
              : order.status === "Cancelled"
                ? "bg-red-600"
                : "bg-[#d4a373] text-[#4a2c2a]"
            }
          `}
        >
          {order.status}
        </span>

        {}
        {canCancel && (
          <button
            onClick={handleCancelOrder}
            className="
              bg-red-600 
              text-white 
              px-5 
              py-2 
              rounded-full 
              font-semibold 
              shadow-md 
              hover:bg-red-700 
              transition
            "
          >
            Cancel Order
          </button>
        )}
      </div>

      {}
      <motion.div
        className="bg-[#f9f5f1] border border-[#e5e7eb] p-6 rounded-3xl shadow-md mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-2xl font-serif text-[#4a2c2a] font-bold mb-2">
          Estimated Delivery
        </h3>
        <p className="text-lg text-[#6b4f4f]">
          Expected within{" "}
          <span className="font-semibold text-[#4a2c2a]">
            30–45 minutes
          </span>
          .
        </p>
      </motion.div>

      {}
      <motion.div
        className="mb-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h3 className="text-3xl font-serif font-bold text-[#4a2c2a] mb-6">
          Order Progress
        </h3>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0">

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center 
                  text-xl font-bold text-white shadow-lg border
                  ${index <= statusIndex
                    ? "bg-[#4a2c2a] border-[#d4a373]"
                    : "bg-gray-300 border-gray-400"
                  }
                `}
              >
                {index + 1}
              </div>

              <p
                className={`
                  mt-3 font-semibold
                  ${index <= statusIndex ? "text-[#4a2c2a]" : "text-gray-500"}
                `}
              >
                {step}
              </p>
            </div>
          ))}

        </div>
      </motion.div>

      {}
      <motion.div
        className="bg-white shadow-xl rounded-3xl p-8 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-3xl font-serif font-bold text-[#4a2c2a] mb-6">
          Items in Your Order
        </h3>

        {order.items.map((item) => (
          <div
            key={item.order_item_id}
            className="flex justify-between items-center border-b border-[#e5e7eb] pb-4 mb-4"
          >
            <div>
              <p className="text-xl font-serif font-semibold text-[#4a2c2a]">
                {item.name}
              </p>
              <p className="text-[#6b4f4f] text-sm">
                {item.quantity} × Rs {item.price_at_order}
              </p>
            </div>

            <p className="text-xl font-bold text-[#4a2c2a]">
              Rs {item.subtotal}
            </p>
          </div>
        ))}

        <div className="text-right text-2xl font-bold text-[#4a2c2a] mt-6">
          Total: Rs {order.total_amount}
        </div>

        <p className="mt-4 text-[#6b4f4f] text-sm">
          Payment Method:{" "}
          <span className="font-semibold text-[#4a2c2a]">
            {order.payment?.payment_method || "N/A"}
          </span>
          {" • "}
          <span className="font-semibold text-[#4a2c2a]">
            {order.payment?.payment_status || "N/A"}
          </span>
        </p>
      </motion.div>
    </div>
  );
}

import { createContext, useContext, useEffect, useState } from "react";
import { MenuContext } from "./MenuContext";
import { supabase } from "../supabaseClient";

export const OrdersContext = createContext();

const ORDERS_KEY = "feastdelights_orders";

export default function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const { adjustItemStock } = useContext(MenuContext);

  
  useEffect(() => {
    async function loadOrders() {
      try {
        const { data, error } = await supabase
          .from("order_header")
          .select(`
            *,
            customer:customer_id (name),
            payment:payment_id (*),
            items:order_item (
              order_item_id,
              item_id,
              quantity,
              price_at_order,
              menu_item:item_id (name, category)
            )
          `)
          .order("order_date", { ascending: false });

        if (error) throw error;

        if (data) {
          
          const formattedOrders = data.map((order) => ({
            order_id: order.order_id,
            customer_id: order.customer_id,
            customer_name: order.customer?.name || "Guest",
            order_date: order.order_date,
            status: order.status,
            total_amount: order.total_amount,
            payment: order.payment,
            items: order.items.map((item) => ({
              order_item_id: item.order_item_id,
              item_id: item.item_id,
              quantity: item.quantity,
              price: item.price_at_order,
              name: item.menu_item?.name || "Unknown Item",
              category: item.menu_item?.category || "Other",
              subtotal: item.quantity * item.price_at_order,
            })),
          }));

          setOrders(formattedOrders);
          localStorage.setItem(ORDERS_KEY, JSON.stringify(formattedOrders));
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    }

    loadOrders();
  }, []);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  
  const deductStock = (items) => {
    items.forEach((i) => {
      adjustItemStock(i.item_id, -i.quantity);
    });
  };

  
  
  const restoreStock = async (items) => {
    console.log("[OrdersContext] restoreStock called with:", items);
    await Promise.all(items.map(async (i) => {
      if (i.item_id) {
        await adjustItemStock(i.item_id, +i.quantity);
      } else {
        console.warn("[OrdersContext] Item missing item_id:", i);
      }
    }));
  };

  const createOrder = ({
    customer,
    cartItems,
    deliveryInfo,
    offer,
    paymentMethod,
  }) => {
    
    
    
    
    return {};
  };

  const updateOrderStatus = async (order_id, newStatus, items = null) => {
    try {
      const { error } = await supabase
        .from("order_header")
        .update({ status: newStatus })
        .eq("order_id", order_id);

      
      if (newStatus === "Cancelled") {
        console.log(`[OrdersContext] Cancelling Order #${order_id}. Fetching items to restore...`);

        
        const { data: dbItems, error: itemsError } = await supabase
          .from("order_item")
          .select("item_id, quantity")
          .eq("order_id", order_id);

        if (itemsError) {
          console.error("[OrdersContext] Error fetching items for restoration:", itemsError);
        } else if (dbItems && dbItems.length > 0) {
          console.log("[OrdersContext] Restoring stock for items:", dbItems);
          await restoreStock(dbItems);
        } else {
          console.warn("[OrdersContext] No items found in DB to restore.");
        }
      }

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) => {
          if (order.order_id !== order_id) return order;
          return { ...order, status: newStatus };
        })
      );

      
      try {
        
        const { data: orderData, error: fetchError } = await supabase
          .from("order_header")
          .select("customer_id")
          .eq("order_id", order_id)
          .single();

        if (fetchError) {
          console.error("Error fetching order for notification:", fetchError);
        } else if (orderData && orderData.customer_id) {
          console.log("Attempting to insert notification for Customer:", orderData.customer_id);
          const { data: notifData, error: notifError } = await supabase.from("notification").insert([
            {
              customer_id: orderData.customer_id,
              message: `Your order #${order_id} is now ${newStatus}.`,
              type: 'In-app',
              order_id: order_id,
              deleted_by_customer: false,
              sent_at: new Date().toISOString(),
            },
          ]).select();

          if (notifError) {
            console.error("❌ Notification Insert Error:", notifError);
          } else {
            console.log("✅ Notification Inserted:", notifData);
          }
        }
      } catch (notifErr) {
        console.error("Unexpected error in notification logic:", notifErr);
      }

    } catch (err) {
      console.error("Error updating order status:", err);
      alert(`Failed to update order status: ${err.message || "Unknown error"}`);
    }
  };

  
  const getOrderById = (id) => orders.find((o) => o.order_id === id);

  const getOrdersByCustomerId = (cid) =>
    orders.filter((o) => o.customer_id === cid);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById, 
        getOrdersByCustomerId, 
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

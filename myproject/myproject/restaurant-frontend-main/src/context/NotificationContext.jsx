import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notification")
        .select("*")
        .eq("customer_id", user.id) 
        .eq("deleted_by_customer", false) 
        .order("sent_at", { ascending: false });

      if (error) console.error("Error fetching notifications:", error);
      else setNotifications(data || []);
    };

    fetchNotifications();

    
    const channel = supabase
      .channel("public:notification")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notification",
          filter: `customer_id=eq.${user.id}`, 
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            
            if (payload.new.deleted_by_customer) {
              setNotifications((prev) => prev.filter(n => n.notification_id !== payload.new.notification_id));
            } else {
              setNotifications((prev) =>
                prev.map((n) => (n.notification_id === payload.new.notification_id ? payload.new : n))
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const pushNotification = async ({ message, type = 'In-app', order_id = null }) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("notification").insert([
        {
          customer_id: user.id, 
          message,
          type: type || 'In-app', 
          order_id,
          deleted_by_customer: false, 
          sent_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (err) {
      console.error("Error pushing notification:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, read: true } : n))
      );

      
      
      
      
      

      
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  
  const deleteNotification = async (id) => {
    try {
      
      setNotifications((prev) => prev.filter((n) => n.notification_id !== id));

      const { error } = await supabase
        .from("notification")
        .update({ deleted_by_customer: true })
        .eq("notification_id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, pushNotification, markAsRead, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

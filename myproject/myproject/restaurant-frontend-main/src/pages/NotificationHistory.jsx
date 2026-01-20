import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotificationHistory() {
  const { notifications, markAsRead, deleteNotification } = useContext(NotificationContext);

  
  const timeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = (now - then) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      {}
      <motion.h1
        className="text-5xl font-serif font-bold text-[#4a2c2a]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Notifications
      </motion.h1>

      <p className="text-[#6b4f4f] mt-2 mb-10">
        View your recent updates, alerts, and order status notifications.
      </p>

      {}
      {notifications.length === 0 && (
        <div className="text-center mt-20 text-[#6b4f4f] text-xl">
          No notifications yet.
        </div>
      )}

      {}
      <div className="space-y-6">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.notification_id}
            className={`
              bg-white rounded-3xl shadow-lg p-6 border border-[#efe7dd] 
              transition 
              ${notif.read ? "opacity-75" : "opacity-100"}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            {}
            <div className="flex justify-between items-start mb-3">
              <span
                className={`
                  px-3 py-1 rounded-full text-sm font-semibold
                  ${notif.type === "error"
                    ? "bg-red-600 text-white"
                    : notif.type === "success"
                      ? "bg-green-600 text-white"
                      : "bg-[#d4a373] text-[#4a2c2a]"
                  }
                `}
              >
                {notif.type ? notif.type.toUpperCase() : "INFO"}
              </span>

              <span className="text-sm text-[#6b4f4f]">
                {timeAgo(notif.sent_at)}
              </span>
            </div>

            {}
            <p className="text-lg text-[#4a2c2a]">{notif.message}</p>

            {}
            {notif.order_id && (
              <Link
                to={`/order/${notif.order_id}`}
                className="text-[#4a2c2a] mt-3 block underline font-semibold hover:text-[#6b4f4f]"
              >
                View Order →
              </Link>
            )}

            {}
            <div className="flex gap-3 mt-4">
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.notification_id)}
                  className="
                    text-sm 
                    bg-[#4a2c2a] 
                    text-[#f9f5f1] 
                    px-4 py-2 
                    rounded-full 
                    hover:bg-[#6b4f4f] 
                    transition
                  "
                >
                  Mark as Read
                </button>
              )}

              <button
                onClick={() => deleteNotification(notif.notification_id)}
                className="
                  text-sm 
                  border border-red-600 
                  text-red-600 
                  px-4 py-2 
                  rounded-full 
                  hover:bg-red-50 
                  transition
                "
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


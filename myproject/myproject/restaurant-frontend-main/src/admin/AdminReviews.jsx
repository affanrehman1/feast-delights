import { useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
import AdminSidebar from "./components/AdminSidebar";
import { motion } from "framer-motion";
import { MenuContext } from "../context/MenuContext";
import { AuthContext } from "../context/AuthContext";

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const { menuItems } = useContext(MenuContext);
    const { users } = useContext(AuthContext);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from("review")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            setReviews(data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to load reviews. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    
    const getCustomerName = (customerId) => {
        const user = users.find((u) => u.id === customerId);
        return user ? user.name : "Unknown Customer";
    };

    const getItemName = (itemId) => {
        const item = menuItems.find((i) => i.item_id === itemId);
        return item ? item.name : "Unknown Item";
    };

    
    const filteredReviews = reviews.filter((review) => {
        const itemName = getItemName(review.item_id).toLowerCase();
        return itemName.includes(search.toLowerCase());
    });

    return (
        <div className="flex bg-[#f7efe5] min-h-screen">
            <AdminSidebar />

            <div className="flex-1 p-10">
                <h1 className="text-5xl font-serif font-bold text-[#4a2c2a]">Customer Reviews</h1>
                <p className="text-[#6b4f4f] mt-2 mb-10">See what your customers are saying about your food.</p>

                {}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search reviews by item name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/3 p-3 border border-[#e5e7eb] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                    />
                </div>

                {loading ? (
                    <div className="text-center text-[#6b4f4f] text-lg">Loading reviews...</div>
                ) : error ? (
                    <div className="text-center text-red-600 text-lg">{error}</div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center text-[#6b4f4f] text-lg">No reviews found.</div>
                ) : (
                    <div className="bg-white shadow-xl rounded-3xl p-8 border border-[#efe7dd] overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[#4a2c2a] border-b border-[#efe7dd]">
                                    {}
                                    <th className="p-4 font-bold text-lg">Date</th>
                                    <th className="p-4 font-bold text-lg">Customer</th>
                                    <th className="p-4 font-bold text-lg">Item</th>
                                    <th className="p-4 font-bold text-lg">Rating</th>
                                    <th className="p-4 font-bold text-lg">Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.map((review, index) => (
                                    <motion.tr
                                        key={review.review_id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-[#f9f5f1] hover:bg-[#f9f5f1] transition"
                                    >
                                        {}
                                        <td className="p-4 text-[#6b4f4f]">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-[#4a2c2a] font-semibold">
                                            {getCustomerName(review.customer_id)}
                                        </td>
                                        <td className="p-4 text-[#4a2c2a]">
                                            {getItemName(review.item_id)}
                                        </td>
                                        <td className="p-4 text-[#d4a373] font-bold text-xl">
                                            {"★".repeat(review.rating)}
                                            <span className="text-gray-300">
                                                {"★".repeat(5 - review.rating)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#6b4f4f] italic">
                                            "{review.comment}"
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

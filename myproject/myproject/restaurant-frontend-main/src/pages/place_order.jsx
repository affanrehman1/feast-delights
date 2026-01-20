import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { OrdersContext } from "../context/OrdersContext";
import { OfferContext } from "../context/OfferContext";
import { MenuContext } from "../context/MenuContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient";

export default function PlaceOrder() {
    const { cart, clearCart } = useContext(CartContext);
    const { user, isLoading } = useContext(AuthContext);
    const { createOrder } = useContext(OrdersContext);
    const { menuItems } = useContext(MenuContext);

    const navigate = useNavigate();

    const [coupon, setCoupon] = useState("");
    const [appliedOffer, setAppliedOffer] = useState(null);

    
    useEffect(() => {
        if (!isLoading && !user) navigate("/login");
    }, [user, isLoading, navigate]);

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    
    const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);

    
    const applyCoupon = async () => {
        if (!coupon.trim()) {
            alert("Please enter an Offer ID.");
            return;
        }

        const offerId = parseInt(coupon.trim());

        if (isNaN(offerId)) {
            alert("Invalid Offer ID. Please enter a number.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("offer")
                .select("*")
                .eq("offer_id", offerId)
                .single();

            if (error || !data) {
                alert("Offer not found or invalid ID!");
                setAppliedOffer(null);
                return;
            }

            
            const today = new Date().toISOString().split("T")[0];
            if (today < data.valid_from || today > data.valid_to) {
                alert(`This offer is not active.\nValid from: ${data.valid_from} to ${data.valid_to}`);
                setAppliedOffer(null);
                return;
            }

            setAppliedOffer(data);
            alert(`Offer applied: ${data.name} (${data.discount_percent}% OFF)`);

        } catch (err) {
            console.error("Error fetching offer:", err);
            alert("Failed to verify offer.");
        }
    };

    const discount = appliedOffer
        ? (subtotal * appliedOffer.discount_percent) / 100
        : 0;

    const total = subtotal - discount;

    
    const placeOrder = async () => {
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

        
        try {
            
            const { data: orderData, error: orderError } = await supabase
                .from("order_header")
                .insert([
                    {
                        customer_id: user.id,
                        total_amount: total,
                        status: "Pending",
                        delivery_type: "Delivery",
                        offer_id: appliedOffer ? appliedOffer.offer_id : null,
                        payment_id: null, 
                        order_date: new Date().toISOString()
                    },
                ])
                .select()
                .single();

            if (orderError) throw orderError;

            const newOrderId = orderData.order_id;

            const { data: paymentData, error: paymentError } = await supabase
                .from("payment")
                .insert([
                    {
                        order_id: newOrderId,
                        payment_method: "Card", 
                        payment_status: "Completed",
                        amount: total,
                        transaction_date: new Date().toISOString()
                    },
                ])
                .select()
                .single();

            if (paymentError) throw paymentError;

            const newPaymentId = paymentData.payment_id;

            
            const { error: updateError } = await supabase
                .from("order_header")
                .update({ payment_id: newPaymentId })
                .eq("order_id", newOrderId);

            if (updateError) throw updateError;

            
            const orderItemsData = cart.map((item) => ({
                order_id: newOrderId,
                item_id: item.item_id,
                quantity: item.quantity,
                price_at_order: item.price, 
            }));

            const { error: itemsError } = await supabase
                .from("order_item")
                .insert(orderItemsData);

            if (itemsError) throw itemsError;

            
            for (const item of cart) {
                
                const { data: currentItem, error: fetchError } = await supabase
                    .from("menu_item")
                    .select("stock_quantity")
                    .eq("item_id", item.item_id)
                    .single();

                if (fetchError) {
                    console.error(`Failed to fetch stock for item ${item.item_id}:`, fetchError);
                    continue; 
                }

                const newStock = Math.max(0, currentItem.stock_quantity - item.quantity);

                const { error: updateStockError } = await supabase
                    .from("menu_item")
                    .update({ stock_quantity: newStock })
                    .eq("item_id", item.item_id);

                if (updateStockError) {
                    console.error(`Failed to update stock for item ${item.item_id}:`, updateStockError);
                }
            }

            
            clearCart();

            
            await supabase.from("notification").insert([
                {
                    customer_id: user.id, 
                    message: `Order #${newOrderId} placed successfully! Payment Status: Completed.`,
                    type: "In-app",
                    order_id: newOrderId,
                    read: false,
                    deleted_by_customer: false,
                    created_at: new Date().toISOString(),
                },
            ]);

            alert("Order placed successfully!");
            navigate(`/orders`);

        } catch (err) {
            console.error("Order placement error:", err);
            alert(`Failed to place order: ${err.message || JSON.stringify(err)}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-12">
            <motion.h1
                className="text-4xl font-serif font-bold text-[#4a2c2a] mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Place Order
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
                        placeholder="Enter Offer ID"
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
                Confirm Order →
            </button>
        </div>
    );
}

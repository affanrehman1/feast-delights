import { createContext, useState, useEffect, useContext } from "react";
import { MenuContext } from "./MenuContext";

export const CartContext = createContext();

const KEY = "feastdelights_cart";

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const { menuItems } = useContext(MenuContext);

  
  useEffect(() => {
    const json = localStorage.getItem(KEY);
    if (json) setCart(JSON.parse(json));
  }, []);

  
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }, [cart]);

  
  useEffect(() => {
    setCart((prev) =>
      prev.map((c) => {
        const menuItem = menuItems.find((m) => m.item_id === c.item_id);
        if (!menuItem) return c; 
        if (c.quantity > menuItem.stock_quantity) {
          return { ...c, quantity: menuItem.stock_quantity };
        }
        return c;
      })
    );
  }, [menuItems]);

  
  const addToCart = (item) => {
    const menuItem = menuItems.find((m) => m.item_id === item.item_id);
    if (!menuItem) {
      alert("Item no longer exists.");
      return;
    }

    if (menuItem.stock_quantity <= 0) {
      alert(`${item.name} is out of stock.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.item_id === item.item_id);

      if (existing) {
        if (existing.quantity >= menuItem.stock_quantity) {
          alert(`Only ${menuItem.stock_quantity} left in stock.`);
          return prev;
        }
        return prev.map((c) =>
          c.item_id === item.item_id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  
  const increaseQty = (id) => {
    const menuItem = menuItems.find((m) => m.item_id === id);
    if (!menuItem) return;

    setCart((prev) =>
      prev.map((c) => {
        if (c.item_id === id) {
          if (c.quantity >= menuItem.stock_quantity) {
            alert(`Maximum available stock: ${menuItem.stock_quantity}`);
            return c;
          }
          return { ...c, quantity: c.quantity + 1 };
        }
        return c;
      })
    );
  };

  
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item_id === id ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.item_id !== id));
  };

  
  const clearCart = () => setCart([]);

  
  const totalAmount = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

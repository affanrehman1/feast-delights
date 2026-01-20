import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const MenuContext = createContext();

const STORAGE_KEY = "feastdelights_menu_items";

export default function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);

  
  useEffect(() => {
    async function loadItems() {
      try {
        const { data, error } = await supabase
          .from("menu_item")
          .select("*")
          .order("item_id", { ascending: true });

        if (error) throw error;

        if (data) {
          setMenuItems(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to load menu items:", err);
      }
    }

    loadItems();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems));
  }, [menuItems]);

  const addItem = async (item) => {
    try {
      
      
      const { item_id, ...rest } = item;

      const { data, error } = await supabase
        .from("menu_item")
        .insert([rest])
        .select()
        .single();

      if (error) throw error;

      setMenuItems((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item");
    }
  };

  const updateItem = async (updated) => {
    try {
      const { error } = await supabase
        .from("menu_item")
        .update(updated)
        .eq("item_id", updated.item_id);

      if (error) throw error;

      setMenuItems((prev) =>
        prev.map((i) => (i.item_id === updated.item_id ? { ...i, ...updated } : i))
      );
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item");
    }
  };

  const deleteItem = async (item_id) => {
    try {
      const { error } = await supabase
        .from("menu_item")
        .delete()
        .eq("item_id", item_id);

      if (error) throw error;

      setMenuItems((prev) => prev.filter((i) => i.item_id !== item_id));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
    }
  };

  const updateStock = async (item_id, newQty) => {
    try {
      const { error } = await supabase
        .from("menu_item")
        .update({ stock_quantity: Math.max(0, newQty) })
        .eq("item_id", item_id);

      if (error) throw error;

      setMenuItems((prev) =>
        prev.map((i) =>
          i.item_id === item_id
            ? { ...i, stock_quantity: Math.max(0, newQty) }
            : i
        )
      );
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  const adjustItemStock = async (item_id, change) => {
    try {
      
      const { data: item, error: fetchError } = await supabase
        .from("menu_item")
        .select("stock_quantity")
        .eq("item_id", item_id)
        .single();

      if (fetchError) {
        console.error(`[MenuContext] Error fetching item ${item_id}:`, fetchError);
        return;
      }

      if (!item) {
        console.error(`[MenuContext] Item ${item_id} not found in DB.`);
        return;
      }

      
      const newQty = Math.max(0, item.stock_quantity + change);
      console.log(`[MenuContext] Updating stock for ${item_id}: ${item.stock_quantity} -> ${newQty}`);

      
      await updateStock(item_id, newQty);

    } catch (err) {
      console.error("[MenuContext] Error in adjustItemStock:", err);
    }
  };

  const toggleAvailability = async (item_id) => {
    const item = menuItems.find((i) => i.item_id === item_id);
    if (!item) return;

    const newStatus = !item.available;

    try {
      const { error } = await supabase
        .from("menu_item")
        .update({ available: newStatus })
        .eq("item_id", item_id);

      if (error) throw error;

      setMenuItems((prev) =>
        prev.map((i) =>
          i.item_id === item_id ? { ...i, available: newStatus } : i
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addItem,
        updateItem,
        deleteItem,
        updateStock,
        adjustItemStock,
        toggleAvailability,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

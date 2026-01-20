import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export const OfferContext = createContext();

const STORAGE_KEY = "feastdelights_offers";

export default function OfferProvider({ children }) {
  const [offers, setOffers] = useState([]);

  
  useEffect(() => {
    async function loadOffers() {
      try {
        const { data, error } = await supabase
          .from("offer")
          .select("*")
          .order("offer_id", { ascending: true });

        if (error) throw error;

        if (data) {
          setOffers(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to load offers:", err);
      }
    }

    loadOffers();
  }, []);

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  }, [offers]);

  
  const addOffer = async (offer) => {
    try {
      const { offer_id, ...rest } = offer; 

      const payload = {
        ...rest,
        name: rest.name.trim().toUpperCase(),
        discount_percent: Number(rest.discount_percent),
        valid_from: rest.valid_from,
        valid_to: rest.valid_to,
        description: rest.description?.trim() || "Special discount offer",
      };

      const { data, error } = await supabase
        .from("offer")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      setOffers((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error adding offer:", err);
      alert("Failed to add offer");
    }
  };

  
  const updateOffer = async (offer) => {
    try {
      const payload = {
        name: offer.name.trim().toUpperCase(),
        discount_percent: Number(offer.discount_percent),
        valid_from: offer.valid_from,
        valid_to: offer.valid_to,
        description: offer.description?.trim() || "Special discount offer",
      };

      const { error } = await supabase
        .from("offer")
        .update(payload)
        .eq("offer_id", offer.offer_id);

      if (error) throw error;

      setOffers((prev) =>
        prev.map((o) => (o.offer_id === offer.offer_id ? { ...offer, ...payload } : o))
      );
    } catch (err) {
      console.error("Error updating offer:", err);
      alert("Failed to update offer");
    }
  };

  
  const deleteOffer = async (offer_id) => {
    try {
      const { error } = await supabase
        .from("offer")
        .delete()
        .eq("offer_id", offer_id);

      if (error) throw error;

      setOffers((prev) => prev.filter((o) => o.offer_id !== offer_id));
    } catch (err) {
      console.error("Error deleting offer:", err);
      alert("Failed to delete offer");
    }
  };

  return (
    <OfferContext.Provider
      value={{ offers, addOffer, updateOffer, deleteOffer }}
    >
      {children}
    </OfferContext.Provider>
  );
}

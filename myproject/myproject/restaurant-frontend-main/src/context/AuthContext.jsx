import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";


export const AuthContext = createContext();

const USERS_KEY = "feastdelights_users";
const SESSION_KEY = "feastdelights_session";


const defaultAdmin = {
  id: 1,
  name: "Admin",
  email: "admin@feastdelights.com",
  password: "admin123",
  role: "admin",
  active: true,
  phone: "",
  address: "",
  created_at: new Date().toISOString(),
};

export default function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const fetchUsers = async () => {
      let allUsers = [defaultAdmin];

      try {
        const { data: dbCustomers, error } = await supabase
          .from("customer")
          .select("*");

        if (!error && dbCustomers) {
          const formattedCustomers = dbCustomers.map((c) => ({
            id: c.customer_id,
            name: c.name,
            email: c.email,
            password: c.password, 
            phone: c.phone,
            address: c.address,
            role: "customer",
            active: true, 
            created_at: c.created_at,
          }));
          allUsers = [...allUsers, ...formattedCustomers];
        } else {
          console.error("Failed to fetch customers:", error);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      }

      setUsers(allUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
    };

    fetchUsers();

    
    const savedSession = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (savedSession) setUser(savedSession);
    setIsLoading(false);
  }, []);

  
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const saveSession = (u) => {
    setUser(u);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
  };

  const clearSession = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  
  const register = async ({ name, email, password, phone, address }) => {
    
    if (users.some((u) => u.email === email)) {
      return { success: false, message: "Email already exists." };
    }

    try {
      const { data, error } = await supabase
        .from("customer")
        .insert([{ name, email, password, phone, address }])
        .select();

      if (error) {
        return { success: false, message: error.message };
      }

      const newUser = {
        id: data[0].customer_id, 
        name: data[0].name,
        email: data[0].email,
        password: data[0].password,
        phone: data[0].phone,
        address: data[0].address,
        role: "customer",
        active: true,
        created_at: data[0].created_at,
      };

      setUsers((prev) => [...prev, newUser]);
      saveSession(newUser);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  
  const login = async (email, password) => {
    
    if (email === defaultAdmin.email && password === defaultAdmin.password) {
      saveSession(defaultAdmin);
      return { success: true, role: "admin" };
    }

    
    try {
      const { data, error } = await supabase
        .from("customer")
        .select("*")
        .eq("email", email)
        .eq("password", password) 
        .single();

      if (error || !data) {
        return { success: false, message: "Invalid credentials." };
      }

      
      
      
      

      const userObj = {
        id: data.customer_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: "customer",
        active: true, 
      };

      saveSession(userObj);
      return { success: true, role: "customer" };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Something went wrong." };
    }
  };

  const logout = () => clearSession();

  
  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  
  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("customer")
        .update(updates)
        .eq("customer_id", user.id);

      if (error) throw error;

      const updated = { ...user, ...updates };

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? updated : u))
      );

      saveSession(updated);
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        logout,
        register,
        toggleUserStatus,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

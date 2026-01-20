import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import MenuProvider from "./context/MenuContext";
import OrdersProvider from "./context/OrdersContext";
import NotificationProvider from "./context/NotificationContext";
import OfferProvider from "./context/OfferContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <OfferProvider>
        <NotificationProvider>
          <MenuProvider>
            <OrdersProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </OrdersProvider>
          </MenuProvider>
        </NotificationProvider>
      </OfferProvider>
    </AuthProvider>
  </React.StrictMode>
);

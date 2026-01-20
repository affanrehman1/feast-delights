import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";


import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PlaceOrder from "./pages/place_order";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OrderDetails from "./pages/Orderdetails";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import NotificationHistory from "./pages/NotificationHistory";


import AdminDashboard from "./admin/AdminDashboard";
import AdminCustomers from "./admin/AdminCustomers";
import AdminInventory from "./admin/AdminInventory";
import AdminReports from "./admin/AdminReports";
import AdminOrders from "./admin/AdminOrders";     
import AdminMenu from "./admin/AdminMenu";         
import AdminOffers from "./admin/AdminOffers";     
import AdminReviews from "./admin/AdminReviews";   



function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <div className="mt-6 px-4 min-h-screen">{children}</div>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>

          {}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/notifications" element={<NotificationHistory />} />

          {}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />      {}
          <Route path="/admin/orders" element={<AdminOrders />} />        {}
          <Route path="/admin/menu" element={<AdminMenu />} />            {}
          <Route path="/admin/offers" element={<AdminOffers />} />        {}
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/reports" element={<AdminReports />} />

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#4a2c2a] text-[#f7efe5] py-16 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">

        {}
        <div>
          <h2 className="text-4xl font-serif font-bold">FeastDelights</h2>
          <p className="text-[#d4a373] italic mt-2">
            “Your Comfort Food Destination”
          </p>
          <p className="text-[#f5e8d9] mt-6 leading-6">
            Indulge in handcrafted meals prepared with passion,
            served in an ambiance of pure comfort and elegance.
          </p>
        </div>

        {}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-[#f5e8d9] text-lg">
            <li>
              <Link to="/" className="hover:text-[#d4a373] cursor-pointer">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-[#d4a373] cursor-pointer">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#d4a373] cursor-pointer">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-[#d4a373] cursor-pointer">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {}
        <div>
          <h3 className="text-2xl font-semibold mb-6">Contact Us</h3>
          <p className="text-[#f5e8d9]">📞 +92 300 1234567</p>
          <p className="text-[#f5e8d9]">📧 support@feastdelights.com</p>
          <p className="text-[#f5e8d9]">📍 Karachi, Pakistan</p>
        </div>
      </div>

      <div className="text-center text-[#e3d4c3] mt-16 text-sm">
        © {new Date().getFullYear()} FeastDelights. Crafted with ❤️ & Coffee.
      </div>
    </footer>
  );
}

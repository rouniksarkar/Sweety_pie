import React, { useState } from "react";
import { Search, ShoppingCart, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../context/AuthContext";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth] = useAuth();
  const { cart } = useCart();
  const isLoggedIn = !!auth?.user;
  const isAdmin = auth?.user?.role === "admin";


  const navigate = useNavigate();

  return (
    <nav className="text-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">MyWebsite</div>
        <SearchInput />
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/Contact" className="hover:text-gray-300">Contact</Link>
          <Link to="/cart" className="hover:text-gray-300">🛒 Cart ({cart.items.length})</Link>
          {isLoggedIn && (
            isAdmin ? (
              <Link to="/admin_dashboard" className="hover:text-gray-300">Admin Dashboard</Link>
            ) : (
              <Link to="/dashboard" className="hover:text-gray-300">Profile</Link>
            )
          )}


          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link to="/login" className="hover:text-gray-300">
              <LogIn />
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2">
          <Link to="/" className="block hover:text-gray-300">Home</Link>
          <Link to="/Contact" className="block hover:text-gray-300">Contact</Link>
          <Link to="/cart" className="hover:text-gray-300">Cart</Link>
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link to="/login" className="block hover:text-gray-300">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3v-8h6v8h3a1 1 0 001-1V7l-7-5zM8 15v2h4v-2H8z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">MedCare</span>
        </Link>

        {/* Search Input in Center */}
        <div className="flex-1 max-w-md hidden sm:block">
          <SearchInput />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/Contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          <Link to="/cart" className="relative hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <ShoppingCart className="h-4.5 w-4.5" />
            <span>Cart</span>
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-3.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cart.items.length}
              </span>
            )}
          </Link>
          
          {isLoggedIn && (
            isAdmin ? (
              <Link to="/admin_dashboard" className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
                Admin
              </Link>
            ) : (
              <Link to="/dashboard" className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
                Profile
              </Link>
            )
          )}

          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link to="/login" className="flex items-center justify-center p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
              <LogIn className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* Mobile Action Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" className="relative text-slate-700 hover:text-blue-600 transition-colors flex items-center">
            <ShoppingCart className="h-5 w-5" />
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {cart.items.length}
              </span>
            )}
          </Link>

          {/* Mobile Toggle */}
          <button
            className="text-slate-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 px-6 py-4 space-y-3 bg-white/95 backdrop-blur-md">
          {/* Mobile Search */}
          <div className="sm:hidden pb-2">
            <SearchInput />
          </div>
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-1.5 font-medium hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/Contact" onClick={() => setIsOpen(false)} className="block py-1.5 font-medium hover:text-blue-600 transition-colors">Contact</Link>
          
          {isLoggedIn && (
            isAdmin ? (
              <Link to="/admin_dashboard" onClick={() => setIsOpen(false)} className="block py-1.5 font-medium hover:text-blue-600 transition-colors">Admin Dashboard</Link>
            ) : (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-1.5 font-medium hover:text-blue-600 transition-colors">Profile</Link>
            )
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

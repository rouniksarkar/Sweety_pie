import React from "react";
import RatingStars from "../components/RatingStars";
import { useSearch } from "../context/Search";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function SearchPage() {
  const [value] = useSearch();
  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-slate-100 pb-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Search Results
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Showing results for: <span className="text-blue-600 font-semibold">"{value.keyword}"</span>
        </p>
      </div>

      {value?.result?.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-2xl">
          <p className="text-slate-500 font-medium text-lg">No products found matching your search.</p>
          <Link
            to="/"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {value?.result?.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={(product) => addToCart(product._id, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

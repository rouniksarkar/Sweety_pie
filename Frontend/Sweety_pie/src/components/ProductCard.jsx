import React from 'react';
import { useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { name, slug, productImage, description, averageRating, ratingsCount, price, finalPrice, discountValue, discountType } = product;
  const hasDiscount = discountValue > 0;
  
  return (
    <div 
      onClick={() => navigate(`/product/${slug}`)}
      className="group relative bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {discountType === "percentage" ? `${discountValue}% OFF` : `₹${discountValue} OFF`}
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full pt-[75%] bg-slate-50 overflow-hidden">
        <img
          src={productImage}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=compress&cs=tinysrgb&w=600"; // wellness fallback
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center pt-0.5">
            <RatingStars rating={averageRating} count={ratingsCount} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          {/* Price Layout */}
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-xs text-slate-400 line-through">₹{price}</span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-600">₹{finalPrice ?? price}</span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-extrabold text-slate-800">₹{price}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/10 hover:shadow-blue-600/20 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

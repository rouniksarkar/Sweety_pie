import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import axios from 'axios';
import priceRanges from "../../components/PriceRange.jsx"
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import Contact from '../../components/Contact.jsx'
import { Link } from 'react-router-dom';
import Banner from '../../components/Banner.jsx';
import BannerCarousel from '../../components/BannerCarousel.jsx';
import RatingStars from '../../components/RatingStars.jsx';
import ProductCard from '../../components/ProductCard.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");

  // 👇 state for load more
  const [visibleCount, setVisibleCount] = useState(4);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/get-product')
      setProducts(data.products || [])
    } catch (error) {
      console.log(error);
    }
  }

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/read-category");
      setCategories(data.category || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, [])

  // filter categories
  const filteredProducts = products.filter((p) => {
    // Category check (works for populated and non-populated)
    const matchCategory =
      selectedCategory === "All" ||
      p.category?.name === selectedCategory ||
      p.category === selectedCategory;

    // Price check (fallback to price if finalPrice missing)
    const priceRange =
      priceRanges.find((range) => range.label === selectedPriceRange) ||
      priceRanges[0];
    const priceToCheck = p.finalPrice ?? p.price;
    const matchPrice = priceToCheck >= priceRange.min && priceToCheck <= priceRange.max;

    return matchCategory && matchPrice;
  });


  // slice products based on visibleCount
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BannerCarousel/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filter Section */}
        <div className="mb-10 space-y-6 bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4.5 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer ${
                  selectedCategory === "All"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4.5 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat.name
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Price Range</h4>
            <div className="flex flex-wrap gap-2.5">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(range.label)}
                  className={`px-4.5 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer ${
                    selectedPriceRange === range.label
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">New Arrivals</h2>
            <p className="mt-1 text-sm text-slate-500">Discover our newly stocked health and wellness essentials</p>
          </div>
          <span className="text-sm text-slate-500 font-medium">
            Showing {visibleProducts.length} of {filteredProducts.length} products
          </span>
        </div>

        {/* Product Cards Grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {visibleProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={(product) => addToCart(product._id, 1)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-slate-500 font-medium text-lg">No products found matching the selected filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedPriceRange("All");
              }}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center mt-12 pt-4">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>

      <Contact />
    </>
  )
}

export default Home

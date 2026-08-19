import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import axios from 'axios';
import priceRanges from "../../components/PriceRange.jsx"
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import Contact from '../../components/Contact.jsx'
import { Link } from 'react-router-dom';
import bannerImg from "../../../src/assets/Media/Banner Image.png"
import immunityBanner from "../../../src/assets/Media/Immunity Boosters Banner.png"
import protinBanner from "../../../src/assets/Media/Protein Supplement Banner.png"
import Banner from '../../components/Banner.jsx';
import BannerCarousel from '../../components/BannerCarousel.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");

  // 👇 state for load more
  const [visibleCount, setVisibleCount] = useState(3);

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
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <>
      <BannerCarousel/>
      <Banner/>
      
      {/* <div className="py-7">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center list-none">
          <li className="px-4 py-2 rounded shadow">Secure Payment</li>
          <li className="px-4 py-2 rounded shadow">Online Support</li>
          <li className="px-4 py-2 rounded shadow">Free Shipping</li>
          <li className="px-4 py-2 rounded shadow">Discount Online</li>
        </ul>
      </div> */}

      <section className="my-12">
          <ul className="grid grid-cols-1 gap-6 text-center md:grid-cols-2 lg:grid-cols-4">
            <li className="flex flex-col items-center rounded-xl bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 10l-2 2-2-2" />
                <path d="M16 10l-4 4-4-4" />
              </svg>
              <h3 className="mt-3 text-lg font-semibold text-gray-800">Secure Payment</h3>
              <p className="text-gray-600 text-sm">Safe and encrypted transactions.</p>
            </li>
            <li className="flex flex-col items-center rounded-xl bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <h3 className="mt-3 text-lg font-semibold text-gray-800">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Get help anytime, anywhere.</p>
            </li>
            <li className="flex flex-col items-center rounded-xl bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <h3 className="mt-3 text-lg font-semibold text-gray-800">Fast Shipping</h3>
              <p className="text-gray-600 text-sm">Delivery to your doorstep in record time.</p>
            </li>
            <li className="flex flex-col items-center rounded-xl bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8l4 4v10z" />
                <line x1="12" y1="12" x2="12" y2="12" />
                <path d="M15 13H9" />
                <path d="M15 9H9" />
              </svg>
              <h3 className="mt-3 text-lg font-semibold text-gray-800">Special Discounts</h3>
              <p className="text-gray-600 text-sm">Enjoy exclusive online promotions.</p>
            </li>
          </ul>
        </section>


      <div className="max-w-300 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 items-center gap-4 px-4 py-7">
          {/* Image Upload Box 1 */}
          <div className="relative w-full h-48 rounded-lg shadow overflow-hidden">
            <label className="cursor-pointer w-full h-full">
              <input type="file" className="hidden" />
              <img
                src={immunityBanner}
                alt="Biotin Supplement"
                className="w-full h-full object-cover"
              />
            </label>
            <div className="absolute inset-0 flex">
              <h2 className="text-3xl md:text-3xl font-bold text-gray-800 leading-snug py-14 px-9">
                Boost Your <br />Immunity
              </h2>
            </div>
          </div>

          {/* Image Upload Box 2 */}
          <div className="relative w-full h-48 rounded-lg shadow overflow-hidden">
            <label className="cursor-pointer w-full h-full">
              <input type="file" className="hidden" />
              <img
                src={protinBanner}
                alt="Protein Supplement"
                className="w-full h-full object-cover"
              />
            </label>
            <div className="absolute inset-0 flex">
              <h2 className="text-3xl md:text-3xl font-bold text-gray-800 leading-snug py-14 px-9">
                Protein Power
              </h2>
            </div>
          </div>
        </div>

        <div className='text-2xl text-center py-2'>New Arrivals</div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-lg border transition ${selectedCategory === "All"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
              }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-lg border transition ${selectedCategory === cat.name
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Price Filter Row */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              className={`px-4 py-2 rounded ${selectedPriceRange === range.label
                ? "bg-green-600 text-white"
                : "bg-gray-200"
                }`}
              onClick={() => setSelectedPriceRange(range.label)}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((p) => (
              <div
                key={p._id}
                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/product/${p.slug}`)}
              >
                <img
                  src={p.productImage}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded mb-4"
                />
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-gray-600 line-clamp-2">{p.description}</p>
                
                //discount price
                <p className="mt-2 font-semibold">
                  {p.discountValue > 0 ? (   // 👈 Check if product has a discount
                    <span className="flex flex-col">

                      {/* 1️⃣ Original Price with line-through */}
                      <span className="line-through text-gray-500 text-sm">
                        ₹{p.price}
                      </span>

                      {/* 2️⃣ Final Discounted Price */}
                      <span className="text-green-600 font-bold">
                        ₹{p.finalPrice ?? p.price}
                      </span>

                      {/* 3️⃣ Discount Label (percentage or flat) */}
                      {p.discountType === "percentage" ? (
                        <span className="text-red-500 text-xs">
                          ({p.discountValue}% OFF)
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs">
                          (₹{p.discountValue} OFF)
                        </span>
                      )}
                    </span>
                  ) : (
                    // 4️⃣ If no discount → just show price normally
                    <span>₹{p.price}</span>
                  )}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p._id, 1);
                  }}
                  className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No products found for this category</p>
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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



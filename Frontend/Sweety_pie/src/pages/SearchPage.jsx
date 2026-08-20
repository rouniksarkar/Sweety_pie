import React from "react";
import RatingStars from "../components/RatingStars";
import { useSearch } from "../context/Search";
import { Link } from "react-router-dom"; // 👈 import Link

export default function SearchPage() {
  const [value] = useSearch();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for:{" "}
        <span className="text-blue-500">{value.keyword}</span>
      </h2>

      {value?.result?.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {value?.result?.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p.slug}`} // ✅ use slug in URL
              className="border p-4 rounded shadow hover:shadow-lg transition block"
            >
              <img
                src={p.productImage} // ✅ Cloudinary URL from DB
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-4"
              />
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-gray-600">{p.description}</p>
              <div className="mt-2">
                <RatingStars rating={p.averageRating} count={p.ratingsCount} />
              </div>
              <p className="mt-2 font-semibold">₹{p.price}</p>
              <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Add to Cart
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

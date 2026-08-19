import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart()

  // Fetch main product when slug changes
  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  // Get main product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/single-product/${params.slug}`
      );
      if (data?.product) {
        setProduct(data.product);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch related products only when product is available
  useEffect(() => {
    if (product?._id && product?.category?._id) {
      getSimilarProducts(product._id, product.category._id);
    }
  }, [product]);

  // Get related products
  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product?.productImage}
            alt={product?.name}
            className="w-full h-80 object-cover rounded shadow"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{product?.name}</h1>
          <p className="text-gray-600 mb-4">{product?.description}</p>
          <p className="mt-2 font-semibold">
                  {product.discountValue > 0 ? (   // 👈 Check if product has a discount
                    <span className="flex flex-col">

                      {/* 1️⃣ Original Price with line-through */}
                      <span className="line-through text-gray-500 text-sm">
                        ₹{product.price}
                      </span>

                      {/* 2️⃣ Final Discounted Price */}
                      <span className="text-green-600 font-bold">
                        ₹{product.finalPrice ?? product.price}
                      </span>

                      {/* 3️⃣ Discount Label (percentage or flat) */}
                      {product.discountType === "percentage" ? (
                        <span className="text-red-500 text-xs">
                          ({product.discountValue}% OFF)
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs">
                          (₹{product.discountValue} OFF)
                        </span>
                      )}
                    </span>
                  ) : (
                    // 4️⃣ If no discount → just show price normally
                    <span>₹{product.price}</span>
                  )}
                </p>
          <button
            onClick={() => addToCart(product._id, 1)}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Similar Products</h2>
        {relatedProducts.length < 1 && <p>No similar products found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <div
              key={p._id}
              className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/product/${p.slug}`)}
            >
              <img
                src={p.productImage}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-4"
              />
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-gray-600">{p.description}</p>
              <p className="mt-2 font-semibold">
                  {product.discountValue > 0 ? (   // 👈 Check if product has a discount
                    <span className="flex flex-col">

                      {/* 1️⃣ Original Price with line-through */}
                      <span className="line-through text-gray-500 text-sm">
                        ₹{product.price}
                      </span>

                      {/* 2️⃣ Final Discounted Price */}
                      <span className="text-green-600 font-bold">
                        ₹{product.finalPrice ?? product.price}
                      </span>

                      {/* 3️⃣ Discount Label (percentage or flat) */}
                      {product.discountType === "percentage" ? (
                        <span className="text-red-500 text-xs">
                          ({product.discountValue}% OFF)
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs">
                          (₹{product.discountValue} OFF)
                        </span>
                      )}
                    </span>
                  ) : (
                    // 4️⃣ If no discount → just show price normally
                    <span>₹{product.price}</span>
                  )}
                </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

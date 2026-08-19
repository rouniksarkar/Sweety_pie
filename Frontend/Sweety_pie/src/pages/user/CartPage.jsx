import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import PaymentButton from "./PaymentButton.jsx";

const CartPage = () => {
  const { cart, fetchCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Calculate total based on finalPrice (if available)
  const getTotal = () => {
    return (cart?.items || []).reduce((acc, item) => {
      const product = item?.productId;
      // Check for finalPrice first, then fall back to price
      const price = product?.finalPrice ?? product?.price ?? 0;
      return acc + price * (item?.quantity || 0);
    }, 0);
  };

  const items = cart?.items || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const product = item?.productId;
            if (!product?._id) return null; // skip if product missing

            // Get the correct price - use finalPrice if available, otherwise use price
            const originalPrice = product?.price ?? 0;
            const finalPrice = product?.finalPrice ?? originalPrice;
            const hasDiscount = finalPrice < originalPrice;

            return (
              <div
                key={product._id}
                className="flex items-center justify-between bg-white p-4 shadow rounded"
              >
                {/* Product Image */}
                <img
                  src={product?.productImage || "/placeholder.jpg"}
                  alt={product?.name || "Product"}
                  className="w-20 h-20 object-cover rounded"
                />

                {/* Product Info */}
                <div className="flex-1 ml-4">
                  <h2 className="font-semibold">{product?.name || "Unnamed Product"}</h2>

                  {/* ✅ Price with discount handling */}
                  <div className="mt-2 font-semibold">
                    {hasDiscount ? (
                      <div className="flex flex-col">
                        <span className="line-through text-gray-500 text-sm">₹{originalPrice}</span>
                        <span className="text-green-600 font-bold">₹{finalPrice}</span>
                        {product.discountType === "percentage" ? (
                          <span className="text-red-500 text-xs">
                            ({product.discountValue}% OFF)
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs">
                            (₹{product.discountValue} OFF)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span>₹{originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateQuantity(product._id, Math.max(1, item.quantity - 1))
                    }
                    className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <span className="mx-3 font-semibold">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(product._id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>

                {/* ✅ Subtotal (uses discounted price if available) */}
                <p className="w-24 text-right font-semibold">
                  ₹{finalPrice * item.quantity}
                </p>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-red-500 ml-4"
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* ✅ Total Price */}
          <div className="flex justify-between mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold">Total:</h2>
            <p className="text-lg font-bold">₹{getTotal()}</p>
          </div>
        </div>
      )}

      <PaymentButton />
    </div>
  );
};

export default CartPage;
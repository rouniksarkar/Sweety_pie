import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const PaymentButton = () => {
  const { cart, clearCart } = useCart();
  const [auth] = useAuth();
  const user = auth?.user;
  const token = auth?.token;
  const [loading, setLoading] = useState(false);

  // 🔹 Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector("#razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getDiscountedPrice = (product) => {
    if (product.finalPrice !== undefined && product.finalPrice !== null) {
      return product.finalPrice;
    }
    if (product.discountPercentage && product.discountPercentage > 0) {
      const discountAmount = (product.price * product.discountPercentage) / 100;
      return product.price - discountAmount;
    }
    if (product.discountAmount && product.discountAmount > 0) {
      return product.price - product.discountAmount;
    }
    return product.price || 0;
  };

  const getTotal = () => {
    if (!cart?.items || cart.items.length === 0) return 0;

    return cart.items.reduce((acc, item) => {
      const product = item.productId || item.product || item;
      const price = getDiscountedPrice(product);
      return acc + price * (item.quantity || 1);
    }, 0);
  };

  const formatCartItems = () => {
    if (!cart?.items || cart.items.length === 0) return [];

    return cart.items.map((item) => {
      const product = item.productId || item.product || item;
      const price = getDiscountedPrice(product);

      return {
        productId: product._id || product.id,
        name: product.name,
        price: price,
        quantity: item.quantity || 1,
        image: product.productImage,
        originalPrice: product.price,
        discountPercentage: product.discountPercentage || 0,
        discountAmount: product.discountAmount || 0
      };
    });
  };

  const handlePayment = async () => {
    if (!cart?.items || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Ensure Razorpay script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const totalAmount = getTotal();
      const formattedItems = formatCartItems();

      if (totalAmount <= 0) {
        alert("Invalid total amount!");
        setLoading(false);
        return;
      }

      // 1️⃣ Create order in DB
      const orderData = {
        items: formattedItems,
        totalAmount: totalAmount,
        status: "pending",
        paymentStatus: "pending"
      };

      const { data: orderResponse } = await axios.post(
        "/api/v1/order/create-order",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!orderResponse.success) {
        alert("Order creation failed. Try again.");
        setLoading(false);
        return;
      }

      // 2️⃣ Create Razorpay order
      const razorpayAmount = Math.round(totalAmount * 100);
      const { data: razorpayOrder } = await axios.post(
        "/api/v1/order/create-razorpay-order",
        {
          amount: razorpayAmount,
          currency: "INR",
          receipt: `order_${orderResponse.order._id}`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const razorpayOrderData = razorpayOrder?.order;
      if (!razorpayOrderData?.id) {
        alert("Failed to create Razorpay order. Try again.");
        setLoading(false);
        return;
      }

      // 3️⃣ Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayAmount,
        currency: "INR",
        name: "My Store",
        description: `Order #${orderResponse.order._id}`,
        order_id: razorpayOrderData.id,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderResponse.order._id,
              userId: user?._id,
              amount: totalAmount
            };

            const res = await axios.post(
              "/api/v1/order/verify-payment",
              verifyData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );

            if (res.data.success) {
              alert("✅ Payment Successful! Order & Invoice Generated.");
              clearCart();
              window.location.href = "/dashboard";
            } else {
              alert("❌ Payment verification failed");
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            alert("Error verifying payment");
          }
        },
        theme: { color: "#3399cc" },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "",
          contact: user?.phone || ""
        },
        notes: {
          orderId: orderResponse.order._id
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(`❌ Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.on("close", function () {
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("❌ Payment error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error processing payment");
      setLoading(false);
    }
  };

  const total = getTotal();
  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <button
      onClick={handlePayment}
      className={`p-3 rounded-lg font-semibold transition-colors ${
        isEmpty || loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
      disabled={isEmpty || loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Processing...
        </span>
      ) : isEmpty ? (
        "Cart is empty"
      ) : (
        `Buy Now - ₹${total.toFixed(2)}`
      )}
    </button>
  );
};

export default PaymentButton;

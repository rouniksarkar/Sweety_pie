import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const UserOrders = () => {
  const [auth] = useAuth();
  const user = auth?.user;
  const token = auth?.token;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/order/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await axios.put(
        `/api/v1/order/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        fetchOrders(); // Refresh the orders list
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'shipped':
        return 'text-purple-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">My Orders</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg shadow-sm bg-white p-6 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                <div>
                  <span className="font-semibold text-gray-700">Order ID: </span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {order._id}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-semibold text-gray-700">Total Amount: </span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{order.totalAmount?.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-gray-700">Status: </span>
                  <span className={`capitalize font-semibold ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-3">Items:</h4>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      {(item.image || item.productId?.productImage) && (
                        <img
                          src={item.image || item.productId?.productImage}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}

                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{item.name}</h5>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>

                        {/* Price Display - handles both old and new schema */}
                        {item.originalPrice > item.discountedPrice ? (
                          <div className="mt-1">
                            <span className="text-green-600 font-semibold">
                              ₹{(item.discountedPrice || item.finalPrice || item.price)?.toLocaleString()} each
                            </span>
                            <span className="line-through text-gray-500 text-sm ml-2">
                              ₹{item.originalPrice?.toLocaleString()}
                            </span>
                            <span className="text-red-600 text-sm ml-2">
                              (Save ₹{((item.originalPrice - (item.discountedPrice || item.finalPrice || item.price)) * item.quantity)?.toLocaleString()})
                            </span>
                          </div>
                        ) : item.finalPrice < item.price ? (
                          <div className="mt-1">
                            <span className="text-green-600 font-semibold">
                              ₹{(item.finalPrice || item.price)?.toLocaleString()} each
                            </span>
                            <span className="line-through text-gray-500 text-sm ml-2">
                              ₹{item.price?.toLocaleString()}
                            </span>
                            <span className="text-red-600 text-sm ml-2">
                              (Save ₹{((item.price - (item.finalPrice || item.price)) * item.quantity)?.toLocaleString()})
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-700">
                            ₹{(item.discountedPrice || item.finalPrice || item.price)?.toLocaleString()} each
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {/* Cancel Button */}
                {order.paymentStatus !== "cancelled" &&
                  order.paymentStatus !== "delivered" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <span>✕</span>
                      Cancel Order
                    </button>
                  )}

                {/* Download Invoice */}
                {/* Download Invoice */}
                {order.paymentStatus === "paid" && (
                  order.invoiceUrl ? (
                    <a
                      href={order.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <span>📄</span>
                      Download Invoice
                    </a>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          const response = await axios.get(`/api/v1/invoice/${order._id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                          });
                          if (response.data.success && response.data.invoiceUrl) {
                            // Update invoiceUrl for this order in local state
                            setOrders(prev =>
                              prev.map(o =>
                                o._id === order._id ? { ...o, invoiceUrl: response.data.invoiceUrl } : o
                              )
                            );
                          }
                        } catch (err) {
                          console.error("Invoice fetch error:", err);
                          toast.error("Failed to generate invoice");
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <span>⏳</span>
                      Generate Invoice
                    </button>
                  )
                )}


                {/* Track Order Button */}
                {order.paymentStatus !== "cancelled" && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <span>🚚</span>
                    Track Order
                  </button>
                )}
              </div>

              {/* Total Savings Display */}
              {(order.totalDiscount > 0 || order.items.some(item => item.originalPrice > item.discountedPrice)) && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-semibold text-center">
                    🎉 You saved ₹{order.totalDiscount?.toLocaleString() ||
                      order.items.reduce((total, item) => {
                        const discount = (item.originalPrice - (item.discountedPrice || item.finalPrice || item.price)) * item.quantity;
                        return total + (discount > 0 ? discount : 0);
                      }, 0)?.toLocaleString()
                    } on this order!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
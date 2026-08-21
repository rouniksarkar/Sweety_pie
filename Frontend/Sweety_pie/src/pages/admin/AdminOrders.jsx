import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  User,
  Clock,
  CheckCircle,
  FileText,
  Filter,
  Eye,
  Calendar,
  AlertCircle
} from "lucide-react";

const AdminOrders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v1/order/all", { withCredentials: true });
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `/api/v1/order/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success("Status updated successfully ✅");
        fetchOrders();
      } else {
        toast.error(data.message || "Update failed ❌");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Error updating status");
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (["paid", "delivered"].includes(s)) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
    if (["processing", "shipped"].includes(s)) {
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    }
    if (s === "pending") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }
    if (s === "cancelled") {
      return "bg-rose-50 text-rose-700 border-rose-100";
    }
    return "bg-slate-50 text-slate-700 border-slate-100";
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(o => o.paymentStatus?.toLowerCase() === statusFilter);

  return (
    <AdminLayout
      title="Orders"
      subtitle="Fulfill customer purchases, track logistics, and manage invoicing"
      onRefresh={fetchOrders}
      refreshLoading={loading}
    >
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter status</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              id={`btn-filter-status-${status}`}
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer transition-all duration-200 capitalize border ${
                statusFilter === status
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-500 font-medium">Fetching orders list...</p>
        </div>
      ) : (
        <section className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Store Orders</h2>
              <p className="text-slate-400 text-xs mt-0.5">Found {filteredOrders.length} orders matching current filter</p>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
              <ShoppingCart className="h-10 w-10 text-slate-300" />
              <span>No orders found matching this category.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={order._id} className="p-6 hover:bg-slate-50/20 transition-colors duration-150 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      {/* Order info details */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-slate-800">
                            #{order._id.toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus || "pending"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-700">{order.user?.name || "Guest"}</span>
                            <span>({order.user?.email || "N/A"})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>Placed: {date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment modification & values */}
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-left md:text-right">
                          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Total amount</span>
                          <span className="text-lg font-black font-mono text-slate-900">{formatPrice(order.totalAmount)}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:inline">Update Status:</label>
                          <select
                            value={order.paymentStatus || "pending"}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible/Expandable Order Products Details */}
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items details</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.items?.map((item, idx) => (
                          <div key={item._id || idx} className="flex items-center gap-3 bg-white border border-slate-100 p-2.5 rounded-xl">
                            <div className="h-10 w-10 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                              {item.productId?.productImage || item.image ? (
                                <img
                                  src={item.productId?.productImage || item.image}
                                  alt={item.productId?.name || item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ShoppingCart className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-grow">
                              <span className="font-semibold text-xs text-slate-800 truncate block">
                                {item.productId?.name || item.name || "Product Deleted"}
                              </span>
                              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                <span>Unit: {formatPrice(item.discountedPrice || item.originalPrice || 0)}</span>
                                <span className="font-semibold text-slate-600">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 font-mono text-xs font-bold text-slate-800">
                              {formatPrice((item.discountedPrice || item.originalPrice || 0) * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;

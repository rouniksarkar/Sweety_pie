import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import {
  ShoppingBag,
  FolderKanban,
  ShoppingCart,
  Image as BannerIcon,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  LayoutDashboard,
  ClipboardList
} from 'lucide-react'

const AdminDashboard = () => {
  const [auth] = useAuth()
  const adminName = auth?.user?.name || 'Admin'

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ordersRes, productsRes, categoriesRes, bannersRes] = await Promise.allSettled([
        axios.get('/api/v1/order/all', { withCredentials: true }),
        axios.get('/api/v1/product/get-product'),
        axios.get('/api/v1/category/read-category'),
        axios.get('/api/v1/banner/getBanner')
      ])

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.orders) {
        setOrders(ordersRes.value.data.orders)
      }
      if (productsRes.status === 'fulfilled' && productsRes.value.data?.products) {
        setProducts(productsRes.value.data.products)
      }
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value.data?.category) {
        setCategories(categoriesRes.value.data.category)
      }
      if (bannersRes.status === 'fulfilled' && bannersRes.value.data?.banner) {
        setBanners(bannersRes.value.data.banner)
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate stats
  const totalRevenue = orders
    .filter(order => ['paid', 'processing', 'shipped', 'delivered'].includes(order.paymentStatus?.toLowerCase()))
    .reduce((acc, order) => acc + (order.totalAmount || 0), 0)

  const lowStockProducts = products.filter(p => p.stock < 10)

  // Calculate best sellers
  const getBestSellers = () => {
    const salesMap = {}
    orders
      .filter(order => order.paymentStatus?.toLowerCase() !== 'cancelled')
      .forEach(order => {
        order.items?.forEach(item => {
          const prodId = item.productId?._id || item.productId
          if (!prodId) return
          if (!salesMap[prodId]) {
            salesMap[prodId] = {
              id: prodId,
              name: item.productId?.name || item.name || 'Unknown Product',
              image: item.productId?.productImage || item.image || '',
              price: item.discountedPrice || item.originalPrice || 0,
              quantitySold: 0,
              revenue: 0
            }
          }
          salesMap[prodId].quantitySold += item.quantity || 0
          salesMap[prodId].revenue += (item.discountedPrice || item.originalPrice || 0) * (item.quantity || 0)
        })
      })
    return Object.values(salesMap)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5)
  }

  const bestSellers = getBestSellers()
  const maxSales = bestSellers.length > 0 ? bestSellers[0].quantitySold : 1

  // Format price helper
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Welcome back, ${adminName}! Here is your business overview.`}
      onRefresh={fetchData}
      refreshLoading={loading}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <p className="text-slate-500 font-medium">Fetching dashboard metrics...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Card 1: Revenue */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-indigo-100 uppercase">Total Revenue</span>
                  <h3 className="text-2xl font-black mt-2 font-mono">{formatPrice(totalRevenue)}</h3>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-100">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Paid & Active orders</span>
              </div>
            </div>

            {/* Card 2: Orders */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-emerald-100 uppercase">Total Orders</span>
                  <h3 className="text-2xl font-black mt-2 font-mono">{orders.length}</h3>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-100">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Placed in store</span>
              </div>
            </div>

            {/* Card 3: Products */}
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-violet-100 uppercase">Products</span>
                  <h3 className="text-2xl font-black mt-2 font-mono">{products.length}</h3>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-violet-100">
                <ClipboardList className="h-3.5 w-3.5" />
                <span>Active catalog items</span>
              </div>
            </div>

            {/* Card 4: Categories */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-amber-100 uppercase">Categories</span>
                  <h3 className="text-2xl font-black mt-2 font-mono">{categories.length}</h3>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <FolderKanban className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-100">
                <FolderKanban className="h-3.5 w-3.5" />
                <span>Product groups</span>
              </div>
            </div>

            {/* Card 5: Banners */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-rose-100 uppercase">Banners</span>
                  <h3 className="text-2xl font-black mt-2 font-mono">{banners.length}</h3>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <BannerIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-100">
                <BannerIcon className="h-3.5 w-3.5" />
                <span>Promotional slides</span>
              </div>
            </div>
          </section>

          {/* Quick Actions Panel */}
          <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-indigo-500" />
              Quick Management Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link
                id="qa-manage-categories"
                to="/admin/category"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 text-center group"
              >
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700">Categories</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Manage taxonomy</span>
              </Link>

              <Link
                id="qa-manage-products"
                to="/admin/product"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-violet-50 hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-200 text-center group"
              >
                <div className="bg-violet-100 text-violet-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-violet-700">Products</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Manage stock & specs</span>
              </Link>

              <Link
                id="qa-manage-orders"
                to="/admin/orders"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 text-center group"
              >
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700">Orders</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Fulfill & update</span>
              </Link>

              <Link
                id="qa-manage-banners"
                to="/admin/bannerList"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-rose-50 hover:border-rose-200 hover:-translate-y-0.5 transition-all duration-200 text-center group"
              >
                <div className="bg-rose-100 text-rose-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  <BannerIcon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-700">Banner List</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Slider setup</span>
              </Link>

              <Link
                id="qa-add-banner"
                to="/admin/bannerForm"
                className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-amber-50 hover:border-amber-200 hover:-translate-y-0.5 transition-all duration-200 text-center group col-span-2 md:col-span-1"
              >
                <div className="bg-amber-100 text-amber-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-700">Add Banner</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Upload new slide</span>
              </Link>
            </div>
          </section>

          {/* Dashboard Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Orders (2/3 width on lg) */}
            <section className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Current Orders</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Review and manage the latest purchases</p>
                  </div>
                  <Link
                    id="view-all-orders-btn"
                    to="/admin/orders"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 group"
                  >
                    View All Orders
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  {orders.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm">No orders recorded yet.</div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-100">
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Payment Status</th>
                          <th className="px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {orders.slice(0, 7).map((order) => {
                          const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })

                          // Determine status styles
                          let statusClass = 'bg-slate-100 text-slate-700 border-slate-200'
                          const lowerStatus = order.paymentStatus?.toLowerCase() || ''
                          if (['paid', 'delivered'].includes(lowerStatus)) {
                            statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          } else if (['processing', 'shipped'].includes(lowerStatus)) {
                            statusClass = 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          } else if (lowerStatus === 'pending') {
                            statusClass = 'bg-amber-50 text-amber-700 border-amber-100'
                          } else if (lowerStatus === 'cancelled') {
                            statusClass = 'bg-rose-50 text-rose-700 border-rose-100'
                          }

                          return (
                            <tr key={order._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                              <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                                #{order._id.substring(order._id.length - 8).toUpperCase()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-800">{order.user?.name || 'Guest'}</div>
                                <div className="text-slate-400 text-xs">{order.user?.email || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 font-semibold font-mono text-slate-800">
                                {formatPrice(order.totalAmount)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
                                  {order.paymentStatus || 'Pending'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500 font-medium">{date}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Showing up to 7 recent orders</span>
                <Link to="/admin/orders" className="text-indigo-600 hover:text-indigo-800">
                  Fulfill Orders &rarr;
                </Link>
              </div>
            </section>

            {/* Right Column: Analytics Cards (1/3 width on lg) */}
            <div className="space-y-8 flex flex-col justify-start">
              {/* Section: Best Selling Products */}
              <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Best Selling Products</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Top-performing catalog items</p>
                </div>

                <div className="mt-5 space-y-4">
                  {bestSellers.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-8">No order items recorded yet.</div>
                  ) : (
                    bestSellers.map((item, idx) => {
                      const progressPercent = Math.round((item.quantitySold / maxSales) * 100)
                      return (
                        <div key={item.id || idx} className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 font-semibold">
                                N/A
                              </div>
                            )}
                          </div>

                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-semibold text-xs text-slate-800 truncate block">
                                {item.name}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 shrink-0">
                                {item.quantitySold} sold
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                              <span>Unit: {formatPrice(item.price)}</span>
                              <span className="font-semibold text-slate-600">
                                Rev: {formatPrice(item.revenue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </section>

              {/* Section: Low Stock Alerts */}
              <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Inventory Health</h2>
                    <p className="text-slate-500 text-xs mt-0.5">Critical items requiring attention</p>
                  </div>
                  {lowStockProducts.length > 0 && (
                    <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-100 animate-pulse">
                      {lowStockProducts.length} Alert{lowStockProducts.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  {lowStockProducts.length === 0 ? (
                    <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-emerald-700 text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      All products are sufficiently stocked!
                    </div>
                  ) : (
                    lowStockProducts.slice(0, 5).map((p, idx) => (
                      <div
                        key={p._id || idx}
                        className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-rose-50/20 hover:border-rose-100 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                          <span className="font-semibold text-xs text-slate-800 truncate block">{p.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                            Stock: {p.stock}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {lowStockProducts.length > 5 && (
                  <Link
                    id="view-low-stock-btn"
                    to="/admin/product"
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 mt-4 text-center hover:underline block"
                  >
                    View all {lowStockProducts.length} low stock items &rarr;
                  </Link>
                )}
              </section>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

export default AdminDashboard

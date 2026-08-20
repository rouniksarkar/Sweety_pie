import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  FolderKanban,
  ShoppingCart,
  Image as BannerIcon,
  PlusCircle,
  Home,
  Calendar,
  MessagesSquare
} from 'lucide-react'

const AdminLayout = ({ children, title, subtitle, onRefresh, refreshLoading }) => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white leading-tight">Admin Portal</h2>
              <span className="text-xs text-slate-400">Control center</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <Link
              id="sidebar-dashboard-link"
              to="/admin_dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin_dashboard')
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </Link>

            <Link
              id="sidebar-category-link"
              to="/admin/category"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin/category')
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <FolderKanban className="h-5 w-5" />
              <span>Categories</span>
            </Link>

            <Link
              id="sidebar-product-link"
              to="/admin/product"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin/product')
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Products</span>
            </Link>

            <Link
              id="sidebar-orders-link"
              to="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin/orders')
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Orders</span>
            </Link>

            <Link
              id="sidebar-banner-list-link"
              to="/admin/bannerList"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin/bannerList')
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <BannerIcon className="h-5 w-5" />
              <span>Banner List</span>
            </Link>

            <Link
              id="sidebar-banner-form-link"
              to="/admin/bannerForm"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin/bannerForm')
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Banner</span>
            </Link>

            <Link
              id="sidebar-contact-queries-link"
              to="/admin/contact-queries"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/admin/contact-queries')
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <MessagesSquare className="h-5 w-5" />
              <span>Customer Queries</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800">
          <Link
            id="sidebar-home-link"
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            <span>Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {onRefresh && (
              <button
                id="btn-refresh-layout"
                onClick={onRefresh}
                disabled={refreshLoading}
                className="flex items-center justify-center p-2.5 text-slate-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <svg className={`h-5 w-5 ${refreshLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live System
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

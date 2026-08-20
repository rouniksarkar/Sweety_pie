import React from 'react';
import Layout from './components/Layout';
import Contact from './components/Contact';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/user/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/user/Dashboard';
import PrivateRoute from './Routes/Private';
import { AuthProvider } from './context/AuthContext'; // ✅ Import your provider
import AdminDashboard from './pages/admin/AdminDashboard';
import Category from './pages/admin/Category';
import Product from './pages/admin/Product';
import UpdateProduct from './pages/admin/updateProducr';
import SearchPage from './pages/SearchPage';
import ProductDetails from './components/ProductDetails';
import CartPage from './pages/user/CartPage';
import PaymentButton from './pages/user/PaymentButton';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBannerForm from './pages/admin/AdminBannerForm';
import AdminBannerList from './pages/admin/AdminBannerList';
import AdminContactQueries from './pages/admin/AdminContactQueries';

function App() {
  return (
    <AuthProvider> {/* ✅ Provide auth context globally */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route
              path="/admin_dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/admin/orders" element={<PrivateRoute><AdminOrders/></PrivateRoute>} />
            <Route path="/admin/category" element={<PrivateRoute><Category /></PrivateRoute>} />
            <Route path="/admin/product" element={<PrivateRoute><Product /></PrivateRoute>} />
            <Route path="/admin/bannerForm" element={<PrivateRoute><AdminBannerForm/></PrivateRoute>} />
            <Route path="/admin/bannerList" element={<PrivateRoute><AdminBannerList/></PrivateRoute>} />
            <Route path="/admin/contact-queries" element={<PrivateRoute><AdminContactQueries/></PrivateRoute>} />
            <Route
              path="/dashboard/admin/update-product/:slug"
              element={<PrivateRoute><UpdateProduct/></PrivateRoute>}
            />
            <Route path="/payment" element={<PaymentButton />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:slug" element={<ProductDetails/>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
    </AuthProvider>
  );
}

export default App;

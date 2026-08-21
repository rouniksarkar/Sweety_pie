import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthBackground from '../../components/AuthBackground';
import toast from 'react-hot-toast';

const Login = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/v1/users/login', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Full login response:', res.data);

      const { user, accessToken } = res.data.data;

      if (!user || !accessToken) {
        toast.error("Login failed: Missing user or token");
        return;
      }

      // Save user and token to context and localStorage
      const token = accessToken;
      setAuth({ user, token });
      localStorage.setItem('auth', JSON.stringify({ user, token }));

      toast.success(res.data.message || 'Login successful!');
      if (user?.role === 'admin') {
        navigate('/admin_dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <AuthBackground>
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:shadow-slate-200/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <span
              className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors"
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Login;


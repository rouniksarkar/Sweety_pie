import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthBackground from "../../components/AuthBackground";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/v1/users/register", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";

      if (msg.toLowerCase().includes("already")) {
        alert("User already exists, please login.");
        navigate("/login");
      } else {
        alert(msg);
      }
    }
  };

  return (
    <AuthBackground>
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:shadow-slate-200/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">Sign up to start shopping premium wellness products</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700"
              required
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
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700"
              required
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
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-700"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Register
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <span
              className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors"
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </AuthBackground>
  );
}


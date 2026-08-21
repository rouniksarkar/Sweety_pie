import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  MapPin, 
  Home, 
  Globe, 
  Hash, 
  Save, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";

const UserProfile = () => {
  const [auth, setAuth] = useAuth();
  const token = auth?.token;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********"); // masked initially
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setUsername(data.user?.username || "");
          setEmail(data.user?.email || "");
          setStreet(data.address?.street || "");
          setCity(data.address?.city || "");
          setState(data.address?.state || "");
          setPin(data.address?.pin || "");
        }
      } catch (error) {
        console.error("Error fetching profile", error);
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // 🔹 Validate address (required)
    if (!street.trim() || !city.trim() || !state.trim() || !pin.trim()) {
      toast.error("All address fields (street, city, state, pin) are required.");
      return;
    }

    if (!username.trim()) {
      toast.error("Username cannot be empty.");
      return;
    }

    setUpdating(true);

    try {
      const payload = {
        username,
        street,
        city,
        state,
        pin,
      };

      // Only send password if changed
      if (password !== "********" && password.trim() !== "") {
        payload.password = password;
      }

      const { data } = await axios.put(
        "/api/v1/users/update-profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } } // Corrected with space
      );

      if (data.success) {
        toast.success("Profile updated successfully! 🎉");
        setPassword("********"); // reset masking
        
        // Update context & local storage
        const updatedAuth = { ...auth, user: data.user };
        setAuth(updatedAuth);
        localStorage.setItem("auth", JSON.stringify(updatedAuth));
      } else {
        toast.error(data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error(
        error.response?.data?.message || "Error updating profile details"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Section with subtle gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <p className="text-blue-100 text-sm mt-1">Manage your profile details and default shipping address</p>
          </div>
          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xl font-extrabold shadow-inner">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpdateProfile} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Personal Account Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">Security & Credentials</h3>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Email (Read-Only) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-600 block">Email Address</label>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
                    Verified
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-400 font-medium cursor-not-allowed outline-none select-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Email addresses are verified and cannot be changed.</p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block">Update Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Leave as ******** to keep your password unchanged.</p>
              </div>
            </div>

            {/* Right Column: Address Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">Default Shipping Address</h3>
              </div>

              {/* Street */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block">Street Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Home className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* City and State Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 block">City</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 block">State</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* PIN Code */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block">PIN / Postal Code</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
            >
              {updating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating Details...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

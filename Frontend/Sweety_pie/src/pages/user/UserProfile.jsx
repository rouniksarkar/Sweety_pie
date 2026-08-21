import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("********"); // masked initially
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setUsername(data.user.username || "");
          setStreet(data.address?.street || "");
          setCity(data.address?.city || "");
          setState(data.address?.state || "");
          setPin(data.address?.pin || "");
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle update
  // Handle update
const handleUpdateProfile = async () => {
  try {
    // 🔹 Validate address (required)
    if (!street.trim() || !city.trim() || !state.trim() || !pin.trim()) {
      toast.error("All address fields (street, city, state, pin) are required.");
      return;
    }

    const token = localStorage.getItem("token");
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
      { headers: { Authorization: `Bearer${token}` } } // ✅ no space after Bearer
    );

    if (data.success) {
      toast.success("Profile updated successfully");
      setPassword("********"); // reset masking
    } else {
      toast.error(data.message || "Error updating profile");
    }
  } catch (error) {
    console.error("Error updating profile", error);
    toast.error("Error updating profile");
  }
};


  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Password (leave as ******** to keep unchanged)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Address */}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Address</h3>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Street</label>
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">PIN</label>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={handleUpdateProfile}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition"
      >
        Update Profile
      </button>
    </div>
  );
};

export default UserProfile;

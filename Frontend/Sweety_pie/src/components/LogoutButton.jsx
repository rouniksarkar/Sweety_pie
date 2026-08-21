import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path
import toast from "react-hot-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });

      // Clear context and storage
      setAuth({ user: null, token: "" });
      localStorage.removeItem("auth");

      // Give time for state to update before redirect
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
      Logout
    </button>
  );
};

export default LogoutButton;

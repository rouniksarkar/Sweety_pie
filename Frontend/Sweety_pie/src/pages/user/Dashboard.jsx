import React, { useState } from "react";
import UserProfile from "./UserProfile.jsx";
import UserOrders from "./UserOrders.jsx";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2 font-semibold ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          User Profile
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 font-semibold ${
            activeTab === "orders"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          User Orders
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && <UserProfile />}
      {activeTab === "orders" && <UserOrders />}
    </div>
  );
};

export default UserDashboard;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  //const[answer,serAnswer]=useState("")
  const navigate=useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post("/api/v1/users/register", form);
    alert("Registration successful!");
    navigate("/Login");
  } catch (err) {
    const msg = err.response?.data?.message || "Registration failed";

    if (msg.toLowerCase().includes("already")) {
      alert("User already exists, please login.");
      navigate("/Login");
    } else {
      alert(msg);
    }
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="username"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        {/* <input
          type="newPassword"
          name="new password"
          placeholder="new Password"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        /> */}
        {/* <select
          name="role"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> */}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
}

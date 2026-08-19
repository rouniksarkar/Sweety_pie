// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// const ForgotPassword = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     answer: '',
//     newPassword: '',
//   });
//   const navigate=useNavigate();

//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     try {
//       const res = await axios.post(
//         '/api/v1/users/forgotPassword',
//         formData,
//         { withCredentials: true }
//       );

//       setMessage(res.data.message || 'Password reset successfully!');
//       navigate("/Login");
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

//       {message && <p className="text-green-600">{message}</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Enter your email"
//           className="w-full border p-2 rounded"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="answer"
//           placeholder="Your security answer"
//           className="w-full border p-2 rounded"
//           value={formData.answer}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="newPassword"
//           placeholder="Enter new password"
//           className="w-full border p-2 rounded"
//           value={formData.newPassword}
//           onChange={handleChange}
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//         >
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ForgotPassword;

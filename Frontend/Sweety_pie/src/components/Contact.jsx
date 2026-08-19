import React from 'react'

const Contact = () => {
  return (
    <div>
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Contact Us</h2>
  <form className="space-y-4">
    <div>
      <label className="block text-gray-600 font-medium mb-1">Name</label>
      <input
        type="text"
        placeholder="Your name"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 font-medium mb-1">Email</label>
      <input
        type="email"
        placeholder="you@example.com"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 font-medium mb-1">Message</label>
      <textarea
        rows="4"
        placeholder="Write your message..."
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      ></textarea>
    </div>

    <div className="text-center">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Send Message
      </button>
    </div>
  </form>
</div>

    </div>
  )
}

export default Contact
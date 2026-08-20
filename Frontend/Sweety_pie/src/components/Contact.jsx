import React, { useState } from 'react'
import axios from 'axios'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const { data } = await axios.post('/api/v1/contact', form)
      setStatus({ type: 'success', message: data.message || 'Your message has been sent.' })
      setForm({ name: '', email: '', message: '' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Unable to send your message. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
  <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Contact Us</h2>
  <form className="space-y-4" onSubmit={handleSubmit}>
    <div>
      <label className="block text-gray-600 font-medium mb-1">Name</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your name"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 font-medium mb-1">Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="you@example.com"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label className="block text-gray-600 font-medium mb-1">Message</label>
      <textarea
        rows="4"
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Write your message..."
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    {status.message && (
      <p className={`rounded-md px-4 py-3 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {status.message}
      </p>
    )}

    <div className="text-center">
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </div>
  </form>
</div>

    </div>
  )
}

export default Contact

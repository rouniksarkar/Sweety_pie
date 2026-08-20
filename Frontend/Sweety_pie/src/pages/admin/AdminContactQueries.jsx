import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Mail, MessageSquare, UserRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

const AdminContactQueries = () => {
  const [auth] = useAuth()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.get('/api/v1/contact', {
        headers: { Authorization: `Bearer ${auth?.token}` },
        withCredentials: true,
      })
      setContacts(data.contacts || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load customer queries.')
    } finally {
      setLoading(false)
    }
  }, [auth?.token])

  useEffect(() => { fetchContacts() }, [fetchContacts])

  return (
    <AdminLayout title="Customer Queries" subtitle="Read messages submitted through the Contact Us form" onRefresh={fetchContacts} refreshLoading={loading}>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-slate-500 font-medium">Loading customer queries...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>
      ) : contacts.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-16 text-center text-slate-400">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          No customer queries yet.
        </div>
      ) : (
        <section className="space-y-4">
          {contacts.map((contact) => (
            <article key={contact._id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold"><UserRound className="h-4 w-4 text-indigo-500" />{contact.name}</div>
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"><Mail className="h-4 w-4" />{contact.email}</a>
                </div>
                <time className="text-xs font-medium text-slate-400">{new Date(contact.createdAt).toLocaleString()}</time>
              </div>
              <p className="mt-5 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{contact.message}</p>
            </article>
          ))}
        </section>
      )}
    </AdminLayout>
  )
}

export default AdminContactQueries

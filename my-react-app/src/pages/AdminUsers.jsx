import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const AdminUsers = () => {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = () => {
    Promise.all([api.get('/users'), api.get('/listings/pending')])
      .then(([userRes, listRes]) => {
        setUsers(userRes.data.users || [])
        setRequests(listRes.data.listings || [])
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load admin data'))
  }

  useEffect(() => {
    load()
  }, [])

  const setRole = async (id, role) => {
    setError('')
    setMessage('')
    try {
      const { data } = await api.patch(`/users/${id}/role`, { role })
      setUsers((current) => current.map((user) => (user._id === id ? data.user : user)))
      setMessage(`${data.user.email} is now ${data.user.role}.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update role')
    }
  }

  const review = async (id, status) => {
    setError('')
    setMessage('')
    try {
      const { data } = await api.patch(`/listings/${id}/review`, { status })
      setRequests((current) => current.filter((item) => item._id !== id))
      setMessage(`${data.listing.title} ${status}.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to review listing')
    }
  }

  return (
    <section className="page">
      <h2>Admin</h2>
      {message && <p className="ok">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h3>Host listing requests</h3>
      {requests.length === 0 && <p className="muted">No pending requests.</p>}
      {requests.map((listing) => (
        <article key={listing._id} className="box row">
          <div>
            <h3>{listing.title}</h3>
            <p className="muted">
              {listing.location} · {listing.hostId?.name} · ₹{listing.pricePerNight}
            </p>
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={() => review(listing._id, 'approved')}>
              Approve
            </button>
            <button className="btn light" type="button" onClick={() => review(listing._id, 'declined')}>
              Decline
            </button>
          </div>
        </article>
      ))}

      <h3>Users</h3>
      {users.map((user) => (
        <article key={user._id} className="box row">
          <div>
            <h3>{user.name}</h3>
            <p className="muted">{user.email}</p>
            <p>Role: {user.role}</p>
          </div>
          <div className="actions">
            {user.role !== 'admin' && (
              <button className="btn" type="button" onClick={() => setRole(user._id, 'admin')}>
                Make admin
              </button>
            )}
            {user.role === 'admin' && user._id !== me._id && (
              <button className="btn light" type="button" onClick={() => setRole(user._id, 'guest')}>
                Remove admin
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

export default AdminUsers

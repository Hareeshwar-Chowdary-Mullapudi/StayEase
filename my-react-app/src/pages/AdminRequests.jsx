import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

const AdminRequests = () => {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api
      .get('/listings/pending')
      .then(({ data }) => setRequests(data.listings || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load requests'))
  }, [])

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
      <div className="row">
        <h2>Host listing requests</h2>
        <Link className="btn light" to="/admin/admins">
          Admins
        </Link>
      </div>
      {message && <p className="ok">{message}</p>}
      {error && <p className="error">{error}</p>}
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
    </section>
  )
}

export default AdminRequests

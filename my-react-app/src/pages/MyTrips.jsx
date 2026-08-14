import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../api/client'

const format = (value) => new Date(value).toLocaleDateString()

const MyTrips = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState(
    location.state?.justRequested ? 'Stay requested. Confirm to proceed when you are ready.' : ''
  )
  const [error, setError] = useState('')
  const [review, setReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    api.get('/bookings/my').then(({ data }) => setBookings(data.bookings || []))
  }, [])

  const cancel = async (id) => {
    const { data } = await api.patch(`/bookings/${id}/status`, { status: 'cancelled' })
    setBookings((current) => current.map((item) => (item._id === id ? data.booking : item)))
  }

  const submitReview = async (listingId) => {
    try {
      await api.post('/reviews', { listingId, ...review })
      setMessage('Review submitted.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to review')
    }
  }

  return (
    <section className="page">
      <h2>My trips</h2>
      {message && <p className="ok">{message}</p>}
      {error && <p className="error">{error}</p>}
      {bookings.length === 0 && <p className="muted">No trips yet.</p>}
      {bookings.map((booking) => (
        <article key={booking._id} className="box row">
          <div>
            <h3>{booking.listingId?.title}</h3>
            <p className="muted">{booking.listingId?.location}</p>
            <p>
              {format(booking.checkIn)} → {format(booking.checkOut)}
            </p>
            <p>
              <strong>₹{booking.totalPrice}</strong> · {booking.status}
            </p>
          </div>
          <div className="actions">
            {booking.status === 'pending' && (
              <button className="btn" type="button" onClick={() => navigate(`/confirm/${booking._id}`)}>
                Confirm to proceed
              </button>
            )}
            {['pending', 'confirmed'].includes(booking.status) && (
              <button className="btn" type="button" onClick={() => cancel(booking._id)}>
                Cancel
              </button>
            )}
            {booking.status === 'completed' && booking.listingId?._id && (
              <div className="review">
                <select
                  value={review.rating}
                  onChange={(e) => setReview((c) => ({ ...c, rating: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <textarea
                  rows="2"
                  value={review.comment}
                  onChange={(e) => setReview((c) => ({ ...c, comment: e.target.value }))}
                />
                <button className="btn" type="button" onClick={() => submitReview(booking.listingId._id)}>
                  Submit review
                </button>
              </div>
            )}
            <Link className="btn light" to={`/listings/${booking.listingId?._id}`}>
              View
            </Link>
          </div>
        </article>
      ))}
    </section>
  )
}

export default MyTrips

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

const HostBookings = () => {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    api.get('/bookings/host').then(({ data }) => setBookings(data.bookings || []))
  }, [])

  const update = async (id, status) => {
    const { data } = await api.patch(`/bookings/${id}/status`, { status })
    setBookings((current) => current.map((item) => (item._id === id ? data.booking : item)))
  }

  return (
    <section className="page">
      <div className="row">
        <h2>Host bookings</h2>
        <Link className="btn light" to="/host/dashboard">
          Dashboard
        </Link>
      </div>
      <p className="muted">Guests confirm by paying. You can decline or mark a stay completed.</p>
      {bookings.map((booking) => (
        <article key={booking._id} className="box row">
          <div>
            <h3>{booking.listingId?.title}</h3>
            <p>Guest: {booking.guestId?.name}</p>
            <p>
              {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()} ·{' '}
              {booking.guests || 1} guest{(booking.guests || 1) > 1 ? 's' : ''}
            </p>
            <p>
              ₹{booking.totalPrice} · {booking.status}
            </p>
          </div>
          <div className="actions">
            {booking.status === 'pending' && (
              <button className="btn light" type="button" onClick={() => update(booking._id, 'declined')}>
                Decline
              </button>
            )}
            {booking.status === 'confirmed' && (
              <button className="btn" type="button" onClick={() => update(booking._id, 'completed')}>
                Mark completed
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

export default HostBookings

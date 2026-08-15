import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const HostDashboard = () => {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    Promise.all([api.get('/listings/mine'), api.get('/bookings/host')]).then(([listRes, bookRes]) => {
      setListings(listRes.data.listings || [])
      setBookings(bookRes.data.bookings || [])
    })
  }, [user])

  return (
    <section className="page">
      <div className="row">
        <h2>Host dashboard</h2>
        <div className="actions">
          <Link className="btn light" to="/host/bookings">
            Bookings
          </Link>
          <Link className="btn" to="/host/listings/new">
            Create listing
          </Link>
        </div>
      </div>
      <div className="stats">
        <div className="box">
          <p className="muted">Listings</p>
          <strong>{listings.length}</strong>
        </div>
        <div className="box">
          <p className="muted">Bookings</p>
          <strong>{bookings.length}</strong>
        </div>
      </div>
      {listings.map((listing) => (
        <article key={listing._id} className="box row">
          <div>
            <h3>{listing.title}</h3>
            <p className="muted">
              {listing.location} · {listing.status}
            </p>
          </div>
          <div className="actions">
            <Link className="btn light" to={`/listings/${listing._id}`}>
              View
            </Link>
            <Link className="btn" to={`/host/listings/${listing._id}/edit`}>
              Edit
            </Link>
          </div>
        </article>
      ))}
    </section>
  )
}

export default HostDashboard

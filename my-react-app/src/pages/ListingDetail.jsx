import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const today = new Date().toISOString().slice(0, 10)

const ListingDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Promise.all([api.get(`/listings/${id}`), api.get(`/reviews/listing/${id}`)])
      .then(([listingRes, reviewRes]) => {
        setListing(listingRes.data.listing)
        setReviews(reviewRes.data.reviews || [])
        setAverageRating(reviewRes.data.averageRating || 0)
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load listing'))
  }, [id])

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 0
  }, [checkIn, checkOut])

  if (error && !listing) return <p className="error">{error}</p>
  if (!listing) return <p className="muted">Loading listing...</p>

  const hostId = listing.hostId?._id || listing.hostId
  const isOwner = user && String(user._id) === String(hostId)
  const photo =
    listing.images?.[0] ||
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'

  const book = async (event) => {
    event.preventDefault()
    if (!user) return navigate('/login')
    setBusy(true)
    setError('')
    try {
      await api.post('/bookings', { listingId: listing._id, checkIn, checkOut, guests })
      navigate('/trips', { state: { justRequested: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to book')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="page">
      <img
        className="hero-img"
        src={photo}
        alt={listing.title}
        onError={(event) => {
          event.currentTarget.src =
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
        }}
      />
      <div className="split">
        <div>
          <p className="muted">{listing.location}</p>
          <h1>{listing.title}</h1>
          <p className="muted">
            Hosted by {listing.hostId?.name || 'Host'} · {listing.maxGuests} guests
            {reviews.length > 0 ? ` · ★ ${averageRating}` : ''}
          </p>
          {isOwner && (user.role === 'host' || user.role === 'admin') && (
            <Link className="btn light" to={`/host/listings/${listing._id}/edit`}>
              Edit listing
            </Link>
          )}
          <p className="body">{listing.description}</p>
          {listing.amenities?.length > 0 && (
            <div className="pills">
              {listing.amenities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          )}
          <h2>Reviews</h2>
          {reviews.length === 0 && <p className="muted">No reviews yet.</p>}
          {reviews.map((review) => (
            <article key={review._id} className="box">
              <strong>
                {review.userId?.name} · ★ {review.rating}
              </strong>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>

        <aside className="box sticky">
          <p>
            <strong>₹{listing.pricePerNight}</strong> / night
          </p>
          {isOwner ? (
            <p className="muted">This is your listing{listing.status !== 'approved' ? ` (${listing.status})` : ''}.</p>
          ) : user?.role === 'host' ? (
            <p className="muted">Switch to guest to request a booking.</p>
          ) : listing.status !== 'approved' ? (
            <p className="muted">Waiting for admin approval.</p>
          ) : (
            <form onSubmit={book}>
              <label>
                Check-in
                <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
              </label>
              <label>
                Check-out
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </label>
              <div className="guest-stepper">
                <span>Guests</span>
                <div>
                  <button
                    type="button"
                    onClick={() => setGuests((n) => Math.max(1, n - 1))}
                    disabled={guests <= 1}
                    aria-label="Fewer guests"
                  >
                    −
                  </button>
                  <strong>{guests}</strong>
                  <button
                    type="button"
                    onClick={() => setGuests((n) => Math.min(listing.maxGuests, n + 1))}
                    disabled={guests >= listing.maxGuests}
                    aria-label="More guests"
                  >
                    +
                  </button>
                </div>
                <p className="muted">Max {listing.maxGuests}</p>
              </div>
              {nights > 0 && (
                <p>
                  {nights} night{nights > 1 ? 's' : ''} · ₹{nights * listing.pricePerNight}
                </p>
              )}
              {error && <p className="error">{error}</p>}
              <button className="btn wide" type="submit" disabled={busy}>
                {user ? 'Request to book' : 'Login to book'}
              </button>
            </form>
          )}
        </aside>
      </div>
    </section>
  )
}

export default ListingDetail

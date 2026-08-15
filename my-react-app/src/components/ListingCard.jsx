import { useState } from 'react'
import { Link } from 'react-router-dom'

const fallback =
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'

const ListingCard = ({ listing, size = 'medium' }) => {
  const [src, setSrc] = useState(listing.images?.[0] || fallback)

  return (
    <Link className={`card card-${size}`} to={`/listings/${listing._id}`}>
      <img src={src} alt={listing.title} onError={() => setSrc(fallback)} />
      <div className="card-body">
        <h3>{listing.title}</h3>
        <p className="muted">{listing.location}</p>
        <p>
          <strong>₹{listing.pricePerNight}</strong> / night
        </p>
      </div>
    </Link>
  )
}

export default ListingCard

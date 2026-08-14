import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext.jsx'

const Home = () => {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/listings')
      .then(({ data }) => setListings(data.listings || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load listings'))
  }, [])

  return (
    <div>
      <section className="hero">
        <p className="hello">{user ? `Hi ${user.name.split(' ')[0]}` : 'StayEase'}</p>
        <h1>Find your next stay</h1>
        <p className="muted">Search homes, pick dates, and confirm with Stripe.</p>
        <SearchBar />
      </section>

      <section className="page">
        <div className="row">
          <h2>Available stays</h2>
          {user && (
            <Link className="btn light" to="/host/listings/new">
              Host your place
            </Link>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        {!error && listings.length === 0 && <p className="muted">No listings yet.</p>}
        <div className="grid">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

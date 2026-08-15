import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import FamousPlaces from '../components/FamousPlaces'
import SearchBar from '../components/SearchBar'
import StayRow from '../components/StayRow'
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

  const byLocation = useMemo(() => {
    const groups = {}
    listings.forEach((listing) => {
      const key = listing.location || 'Other'
      if (!groups[key]) groups[key] = []
      groups[key].push(listing)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [listings])

  return (
    <div>
      <section className="hero">
        <p className="hello">{user ? `Hi ${user.name.split(' ')[0]}` : 'StayEase'}</p>
        <h1>Find your next stay</h1>
        <p className="muted">Search homes, pick dates, and confirm with Stripe.</p>
        <SearchBar />
        <FamousPlaces />
      </section>

      <section className="page">
        <div className="row">
          <h2>Available stays</h2>
          {(user?.role === 'host' || user?.role === 'admin') && (
            <Link className="btn light" to="/host/listings/new">
              Host your place
            </Link>
          )}
        </div>
        {error && <p className="error">{error}</p>}
        {!error && listings.length === 0 && <p className="muted">No listings yet.</p>}
        {byLocation.map(([location, items]) => (
          <StayRow key={location} title={location} listings={items} />
        ))}
      </section>
    </div>
  )
}

export default Home

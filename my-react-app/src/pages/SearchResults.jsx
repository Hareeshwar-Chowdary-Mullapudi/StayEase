import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/client'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'

const SearchResults = () => {
  const [params] = useSearchParams()
  const [listings, setListings] = useState([])
  const filters = useMemo(
    () => ({
      location: params.get('location') || '',
      guests: params.get('guests') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
    }),
    [params]
  )

  useEffect(() => {
    api.get('/listings', { params: filters }).then(({ data }) => setListings(data.listings || []))
  }, [filters])

  return (
    <section className="page">
      <div className="row">
        <h2>Search stays</h2>
        <Link className="btn light" to="/">
          Back home
        </Link>
      </div>
      <SearchBar initialValues={filters} />
      {listings.length === 0 && (
        <p className="muted">No stays in {filters.location || 'this search'} yet.</p>
      )}
      <div className="grid">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </section>
  )
}

export default SearchResults

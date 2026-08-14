import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ initialValues = {} }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    location: initialValues.location || '',
    guests: initialValues.guests || '',
    minPrice: initialValues.minPrice || '',
    maxPrice: initialValues.maxPrice || '',
  })

  const onChange = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const onSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <form className="search" onSubmit={onSubmit}>
      <label>
        Location
        <input name="location" placeholder="Goa, Manali..." value={form.location} onChange={onChange} />
      </label>
      <label>
        Guests
        <input name="guests" type="number" min="1" placeholder="2" value={form.guests} onChange={onChange} />
      </label>
      <label>
        Min price
        <input name="minPrice" type="number" min="0" placeholder="500" value={form.minPrice} onChange={onChange} />
      </label>
      <label>
        Max price
        <input name="maxPrice" type="number" min="0" placeholder="5000" value={form.maxPrice} onChange={onChange} />
      </label>
      <label className="search-action">
        Search
        <button className="btn search-btn" type="submit">
          Search
        </button>
      </label>
    </form>
  )
}

export default SearchBar

import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'

const empty = {
  title: '',
  description: '',
  location: '',
  pricePerNight: '',
  maxGuests: '2',
  amenities: '',
  images: '',
}

const ListingForm = ({ mode }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(mode === 'edit')

  useEffect(() => {
    if (mode !== 'edit') return
    api.get(`/listings/${id}`).then(({ data }) => {
      const listing = data.listing
      setForm({
        title: listing.title,
        description: listing.description,
        location: listing.location,
        pricePerNight: listing.pricePerNight,
        maxGuests: listing.maxGuests,
        amenities: (listing.amenities || []).join(', '),
        images: (listing.images || []).join(', '),
      })
      setLoading(false)
    })
  }, [id, mode])

  const onChange = (event) => setForm((c) => ({ ...c, [event.target.name]: event.target.value }))

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const images = form.images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      if (file) {
        const data = new FormData()
        data.append('image', file)
        const upload = await api.post('/upload', data)
        images.unshift(upload.data.url)
      }
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        pricePerNight: Number(form.pricePerNight),
        maxGuests: Number(form.maxGuests),
        amenities: form.amenities
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        images,
      }
      const { data } =
        mode === 'create'
          ? await api.post('/listings', payload)
          : await api.put(`/listings/${id}`, payload)
      navigate(mode === 'create' ? '/host/dashboard' : `/listings/${data.listing._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save listing')
    }
  }

  if (loading) return <p className="muted">Loading...</p>

  return (
    <section className="panel wide">
      <h1>{mode === 'create' ? 'Request a listing' : 'Edit listing'}</h1>
      {mode === 'create' && <p className="muted">Admin will approve or decline before guests can see it.</p>}
      <form onSubmit={onSubmit}>
        <label>
          Title
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={onChange} required />
        </label>
        <label>
          Description
          <textarea name="description" rows="4" value={form.description} onChange={onChange} required />
        </label>
        <div className="two">
          <label>
            Price per night
            <input name="pricePerNight" type="number" min="0" value={form.pricePerNight} onChange={onChange} required />
          </label>
          <label>
            Max guests
            <input name="maxGuests" type="number" min="1" value={form.maxGuests} onChange={onChange} required />
          </label>
        </div>
        <label>
          Amenities (comma separated)
          <input name="amenities" value={form.amenities} onChange={onChange} placeholder="WiFi, Kitchen" />
        </label>
        <label>
          Photo
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <label>
          Image URLs
          <input name="images" value={form.images} onChange={onChange} placeholder="https://..." />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <Link className="btn light" to="/host/dashboard">
            Cancel
          </Link>
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </section>
  )
}

export const CreateListing = () => <ListingForm mode="create" />
export const EditListing = () => <ListingForm mode="edit" />

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/client'

const ConfirmStay = () => {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api
      .get(`/bookings/${bookingId}`)
      .then(({ data }) => setBooking(data.booking))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load booking'))
  }, [bookingId])

  const pay = async () => {
    setBusy(true)
    setError('')
    try {
      const { data } = await api.post('/payments/create-checkout', { bookingId })
      window.location.href = data.url
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start payment')
      setBusy(false)
    }
  }

  if (error && !booking) {
    return (
      <section className="panel">
        <p className="error">{error}</p>
        <Link to="/trips">Back to trips</Link>
      </section>
    )
  }

  if (!booking) return <p className="muted">Loading...</p>

  return (
    <section className="panel">
      <h1>Confirm to proceed</h1>
      <p>{booking.listingId?.title}</p>
      <p className="muted">{booking.listingId?.location}</p>
      <p>
        Total <strong>₹{booking.totalPrice}</strong>
      </p>
      {error && <p className="error">{error}</p>}
      <button className="btn wide" type="button" onClick={pay} disabled={busy}>
        {busy ? 'Opening Stripe...' : 'Pay with Stripe'}
      </button>
      <Link className="btn light wide" to="/trips">
        Back
      </Link>
    </section>
  )
}

export default ConfirmStay

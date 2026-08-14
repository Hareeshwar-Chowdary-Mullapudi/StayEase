import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/client'

const PaymentSuccess = () => {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [text, setText] = useState('Confirming payment...')

  useEffect(() => {
    if (!sessionId) {
      setText('Payment complete.')
      return
    }
    api
      .post('/payments/confirm', { sessionId })
      .then(() => setText('Your stay is confirmed.'))
      .catch(() => setText('Payment received. Open My trips to see status.'))
  }, [sessionId])

  return (
    <section className="panel">
      <h1>Payment successful</h1>
      <p>{text}</p>
      <Link className="btn" to="/trips">
        View my trips
      </Link>
    </section>
  )
}

export default PaymentSuccess

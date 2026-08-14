import { Link } from 'react-router-dom'

const PaymentCancel = () => (
  <section className="panel">
    <h1>Payment cancelled</h1>
    <p>No charge was made. You can try again from My trips.</p>
    <Link className="btn" to="/trips">
      Back to trips
    </Link>
  </section>
)

export default PaymentCancel

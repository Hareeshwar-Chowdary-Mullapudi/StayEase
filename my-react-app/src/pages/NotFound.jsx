import { Link } from 'react-router-dom'

const NotFound = () => (
  <section className="panel">
    <h1>Page not found</h1>
    <Link className="btn" to="/">
      Go home
    </Link>
  </section>
)

export default NotFound

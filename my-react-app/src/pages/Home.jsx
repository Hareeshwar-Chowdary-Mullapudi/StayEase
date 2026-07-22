import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Home = () => {
  const { user } = useAuth()

  return (
    <section className="hero-section">
      <div>
        <p className="eyebrow">Airbnb-style marketplace</p>
        <h1>Find your next stay, or become a host.</h1>
        <p className="hero-copy">
          Part 3 adds login and registration to the React app. Listings and
          bookings come next.
        </p>

        <div className="actions">
          {user ? (
            <p className="status-card">
              You are signed in as <strong>{user.name}</strong> ({user.role}).
            </p>
          ) : (
            <>
              <Link className="button primary" to="/register">
                Create account
              </Link>
              <Link className="button secondary" to="/login">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Home

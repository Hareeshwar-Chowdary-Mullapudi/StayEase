import { Link, useNavigate } from 'react-router-dom'
import { FAMOUS_PLACES } from '../data/places.js'

const Places = () => {
  const navigate = useNavigate()

  return (
    <section className="page">
      <div className="row">
        <h2>Famous places in India</h2>
        <Link className="btn light" to="/">
          Back home
        </Link>
      </div>
      <div className="places-grid">
        {FAMOUS_PLACES.map((place) => (
          <button
            key={place.name}
            type="button"
            className="place-card"
            onClick={() => navigate(`/search?location=${encodeURIComponent(place.name)}`)}
          >
            <div className="place-photo">
              <img src={place.image} alt={place.spot} />
            </div>
            <strong>{place.name}</strong>
            <span className="place-spot">{place.spot}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default Places

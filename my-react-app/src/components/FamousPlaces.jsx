import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FAMOUS_PLACES } from '../data/places.js'

const FamousPlaces = () => {
  const navigate = useNavigate()
  const scroller = useRef(null)

  const scrollByCards = (direction) => {
    const node = scroller.current
    if (!node) return
    node.scrollBy({ left: direction * 280, behavior: 'smooth' })
  }

  return (
    <div className="places">
      <div className="places-head">
        <h3>Famous places in India</h3>
        <div className="places-nav">
          <button type="button" className="places-arrow" onClick={() => scrollByCards(-1)} aria-label="Previous">
            ‹
          </button>
          <button type="button" className="places-arrow" onClick={() => scrollByCards(1)} aria-label="Next">
            ›
          </button>
        </div>
      </div>
      <div className="places-row" ref={scroller}>
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
        <button type="button" className="place-see-all" onClick={() => navigate('/places')}>
          <div className="place-stack">
            {FAMOUS_PLACES.slice(0, 3).map((place) => (
              <img key={place.name} src={place.image} alt="" />
            ))}
          </div>
          <strong>See all</strong>
        </button>
      </div>
    </div>
  )
}

export default FamousPlaces
export { FAMOUS_PLACES }

import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const fallback =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'

export const FAMOUS_PLACES = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e6f2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145f127a48?auto=format&fit=crop&w=800&q=80' },
  { name: 'Udaipur', image: 'https://images.unsplash.com/photo-1615836245337-f0c45fb6b4c8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kochi', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' },
  { name: 'Darjeeling', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Jodhpur', image: 'https://images.unsplash.com/photo-1532664189809-02133fee698d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pondicherry', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74250?auto=format&fit=crop&w=800&q=80' },
]

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
              <img
                src={place.image}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = fallback
                }}
              />
            </div>
            <strong>{place.name}</strong>
          </button>
        ))}
        <button type="button" className="place-see-all" onClick={() => navigate('/search')}>
          <div className="place-stack">
            {FAMOUS_PLACES.slice(0, 3).map((place) => (
              <img
                key={place.name}
                src={place.image}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = fallback
                }}
              />
            ))}
          </div>
          <strong>See all</strong>
        </button>
      </div>
    </div>
  )
}

export default FamousPlaces

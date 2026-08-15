import { useRef } from 'react'
import ListingCard from './ListingCard.jsx'

const StayRow = ({ title, listings }) => {
  const scroller = useRef(null)
  if (!listings.length) return null

  const scrollByCards = (direction) => {
    const node = scroller.current
    if (!node) return
    node.scrollBy({ left: direction * 220, behavior: 'smooth' })
  }

  return (
    <div className="stay-row">
      <div className="places-head">
        <h3>{title}</h3>
        {listings.length > 1 && (
          <div className="places-nav">
            <button type="button" className="places-arrow" onClick={() => scrollByCards(-1)} aria-label="Previous">
              ‹
            </button>
            <button type="button" className="places-arrow" onClick={() => scrollByCards(1)} aria-label="Next">
              ›
            </button>
          </div>
        )}
      </div>
      <div className="places-row stay-scroll" ref={scroller}>
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} size="medium" />
        ))}
      </div>
    </div>
  )
}

export default StayRow

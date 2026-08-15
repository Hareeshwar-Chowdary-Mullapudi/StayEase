import { useNavigate } from 'react-router-dom'

export const FAMOUS_PLACES = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=600&q=80' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145f127a48?auto=format&fit=crop&w=600&q=80' },
  { name: 'Udaipur', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80' },
  { name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
  { name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1600596542813-5733d8e0c35e?auto=format&fit=crop&w=600&q=80' },
]

const FamousPlaces = () => {
  const navigate = useNavigate()

  return (
    <div className="places">
      <h3>Famous places in India</h3>
      <div className="places-row">
        {FAMOUS_PLACES.map((place) => (
          <button
            key={place.name}
            type="button"
            className="place-card"
            onClick={() => navigate(`/search?location=${encodeURIComponent(place.name)}`)}
          >
            <img src={place.image} alt={place.name} />
            <span>{place.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FamousPlaces

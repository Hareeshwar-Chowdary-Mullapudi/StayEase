import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Listing from '../models/Listing.js'

export const SEED_LISTINGS = [
  {
    title: 'Beach shack near Palolem',
    location: 'Goa',
    pricePerNight: 3200,
    maxGuests: 4,
    amenities: ['WiFi', 'Beach access'],
    description: 'Sandy path to Palolem beach. Simple stay for a Goa weekend.',
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Cedar cabin with mountain view',
    location: 'Manali',
    pricePerNight: 4100,
    maxGuests: 3,
    amenities: ['Heating', 'Kitchen'],
    description: 'Quiet cabin above the Mall Road with snow views in winter.',
    images: ['https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Pink city courtyard haveli',
    location: 'Jaipur',
    pricePerNight: 3800,
    maxGuests: 5,
    amenities: ['WiFi', 'Courtyard'],
    description: 'Heritage rooms around a courtyard, walk to Hawa Mahal.',
    images: ['https://images.unsplash.com/photo-1477587458883-47145f127a48?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Lake-view studio',
    location: 'Udaipur',
    pricePerNight: 4500,
    maxGuests: 2,
    amenities: ['Lake view', 'AC'],
    description: 'Look over Lake Pichola from a compact studio.',
    images: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Ganga-side yoga loft',
    location: 'Rishikesh',
    pricePerNight: 2200,
    maxGuests: 2,
    amenities: ['WiFi', 'Yoga mat'],
    description: 'Loft near Laxman Jhula. Easy walk to cafes and the river.',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Sea-facing apartment in Bandra',
    location: 'Mumbai',
    pricePerNight: 6200,
    maxGuests: 3,
    amenities: ['AC', 'WiFi', 'Kitchen'],
    description: 'Bright flat close to Bandstand. City stay with a sea breeze.',
    images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Hauz Khas loft',
    location: 'Delhi',
    pricePerNight: 3600,
    maxGuests: 3,
    amenities: ['WiFi', 'Kitchen'],
    description: 'Industrial loft near the village cafes and the lake.',
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Garden cottage in Indiranagar',
    location: 'Bengaluru',
    pricePerNight: 3400,
    maxGuests: 4,
    amenities: ['Garden', 'WiFi', 'Parking'],
    description: 'Quiet cottage with a small garden, 10 minutes to MG Road.',
    images: ['https://images.unsplash.com/photo-1600596542813-5733d8e0c35e?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Backwater bungalow',
    location: 'Kochi',
    pricePerNight: 3900,
    maxGuests: 4,
    amenities: ['Backwaters', 'Kitchen'],
    description: 'Sit out over the water. Fort Kochi is a short drive.',
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Tea-estate bungalow',
    location: 'Darjeeling',
    pricePerNight: 4300,
    maxGuests: 4,
    amenities: ['Fireplace', 'Mountain view'],
    description: 'Wake to Kanchenjunga views and a cup of estate tea.',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'Blue-city rooftop stay',
    location: 'Jodhpur',
    pricePerNight: 2800,
    maxGuests: 3,
    amenities: ['Rooftop', 'WiFi'],
    description: 'Look over the blue houses toward Mehrangarh Fort.',
    images: ['https://images.unsplash.com/photo-1477587458883-47145f127a48?auto=format&fit=crop&w=1200&q=80'],
  },
  {
    title: 'French-quarter guesthouse',
    location: 'Pondicherry',
    pricePerNight: 3100,
    maxGuests: 2,
    amenities: ['WiFi', 'Breakfast'],
    description: 'Yellow walls, bicycles, and the promenade two streets away.',
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74250?auto=format&fit=crop&w=1200&q=80'],
  },
]

export const seedListingsIfEmpty = async () => {
  await Listing.updateMany({ status: { $exists: false } }, { $set: { status: 'approved' } })

  let host = await User.findOne({ email: 'seed.host@stayease.local' })
  if (!host) {
    host = await User.create({
      name: 'StayEase Host',
      email: 'seed.host@stayease.local',
      passwordHash: await bcrypt.hash('stayease123', 10),
      role: 'host',
    })
  }

  let added = 0
  for (const item of SEED_LISTINGS) {
    const exists = await Listing.findOne({ location: new RegExp(`^${item.location}$`, 'i') })
    if (exists) continue
    await Listing.create({ ...item, hostId: host._id, status: 'approved' })
    added += 1
  }

  if (added > 0) console.log(`Seeded ${added} listings`)
}

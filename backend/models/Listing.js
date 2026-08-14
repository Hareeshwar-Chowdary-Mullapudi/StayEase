import mongoose from 'mongoose'

const listingSchema = new mongoose.Schema(
  {
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    maxGuests: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
)

export default mongoose.model('Listing', listingSchema)

import mongoose from 'mongoose'
import Booking from './Booking.js'

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

reviewSchema.index({ userId: 1, listingId: 1 }, { unique: true })

export const canUserReviewListing = async (userId, listingId) => {
  const stay = await Booking.findOne({
    guestId: userId,
    listingId,
    status: 'completed',
  })
  return Boolean(stay)
}

export default mongoose.model('Review', reviewSchema)

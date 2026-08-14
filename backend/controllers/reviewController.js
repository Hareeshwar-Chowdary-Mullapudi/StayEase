import Review, { canUserReviewListing } from '../models/Review.js'

export const createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body
    const allowed = await canUserReviewListing(req.user._id, listingId)
    if (!allowed) {
      res.status(403)
      throw new Error('You can review only after a completed stay')
    }

    const review = await Review.create({
      userId: req.user._id,
      listingId,
      rating,
      comment,
    })
    res.status(201).json({ review })
  } catch (error) {
    next(error)
  }
}

export const getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listingId: req.params.id }).populate(
      'userId',
      'name'
    )
    const averageRating =
      reviews.length === 0
        ? 0
        : Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1)
          )
    res.json({ reviews, averageRating })
  } catch (error) {
    next(error)
  }
}

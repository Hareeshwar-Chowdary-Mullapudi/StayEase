import Listing from '../models/Listing.js'
import Booking from '../models/Booking.js'

export const getListings = async (req, res, next) => {
  try {
    const { location, minPrice, maxPrice, guests } = req.query
    const filter = {}

    if (location) filter.location = { $regex: location, $options: 'i' }
    if (guests) filter.maxGuests = { $gte: Number(guests) }
    if (minPrice || maxPrice) {
      filter.pricePerNight = {}
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice)
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice)
    }

    const listings = await Listing.find(filter).populate('hostId', 'name').sort({ createdAt: -1 })
    res.json({ listings })
  } catch (error) {
    next(error)
  }
}

export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('hostId', 'name email')
    if (!listing) {
      res.status(404)
      throw new Error('Listing not found')
    }
    res.json({ listing })
  } catch (error) {
    next(error)
  }
}

export const getListingAvailability = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      listingId: req.params.id,
      status: { $in: ['pending', 'confirmed'] },
    }).select('checkIn checkOut')

    res.json({ bookedRanges: bookings })
  } catch (error) {
    next(error)
  }
}

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({ ...req.body, hostId: req.user._id })
    res.status(201).json({ listing })
  } catch (error) {
    next(error)
  }
}

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
      res.status(404)
      throw new Error('Listing not found')
    }
    if (listing.hostId.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error('You can only edit your own listing')
    }

    Object.assign(listing, req.body)
    await listing.save()
    res.json({ listing })
  } catch (error) {
    next(error)
  }
}

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
      res.status(404)
      throw new Error('Listing not found')
    }
    if (listing.hostId.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error('You can only delete your own listing')
    }
    await listing.deleteOne()
    res.json({ message: 'Listing deleted' })
  } catch (error) {
    next(error)
  }
}

import Booking from '../models/Booking.js'
import Listing from '../models/Listing.js'

const day = (value) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

const nightsBetween = (start, end) =>
  Math.round((end - start) / (1000 * 60 * 60 * 24))

const hasOverlap = async (listingId, checkIn, checkOut) => {
  const conflict = await Booking.findOne({
    listingId,
    status: { $in: ['pending', 'confirmed'] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  })
  return Boolean(conflict)
}

export const createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut } = req.body
    const start = day(checkIn)
    const end = day(checkOut)
    const today = day(new Date())

    if (!listingId || !checkIn || !checkOut) {
      res.status(400)
      throw new Error('Dates and listing are required')
    }
    if (end <= start) {
      res.status(400)
      throw new Error('Check-out must be after check-in')
    }
    if (start < today) {
      res.status(400)
      throw new Error('Past dates cannot be booked')
    }

    const listing = await Listing.findById(listingId)
    if (!listing) {
      res.status(404)
      throw new Error('Listing not found')
    }
    if (listing.status !== 'approved') {
      res.status(400)
      throw new Error('This listing is not available yet')
    }
    if (req.user.role === 'host') {
      res.status(403)
      throw new Error('Switch to guest to book a stay')
    }
    if (listing.hostId.toString() === req.user._id.toString()) {
      res.status(400)
      throw new Error('You cannot book your own listing')
    }
    if (await hasOverlap(listingId, start, end)) {
      res.status(400)
      throw new Error('Those dates are already booked')
    }

    const booking = await Booking.create({
      guestId: req.user._id,
      listingId,
      checkIn: start,
      checkOut: end,
      totalPrice: nightsBetween(start, end) * listing.pricePerNight,
    })

    const populated = await Booking.findById(booking._id).populate('listingId')
    res.status(201).json({ booking: populated })
  } catch (error) {
    next(error)
  }
}

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guestId: req.user._id })
      .populate('listingId')
      .sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (error) {
    next(error)
  }
}

export const getHostBookings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ hostId: req.user._id }).select('_id')
    const bookings = await Booking.find({ listingId: { $in: listings.map((item) => item._id) } })
      .populate('listingId')
      .populate('guestId', 'name email')
      .sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (error) {
    next(error)
  }
}

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listingId')
    if (!booking) {
      res.status(404)
      throw new Error('Booking not found')
    }
    if (booking.guestId.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error('Not authorized')
    }
    res.json({ booking })
  } catch (error) {
    next(error)
  }
}

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const booking = await Booking.findById(req.params.id).populate('listingId')
    if (!booking) {
      res.status(404)
      throw new Error('Booking not found')
    }

    const hostId = booking.listingId.hostId.toString()
    const guestId = booking.guestId.toString()
    const userId = req.user._id.toString()
    const isHost = hostId === userId
    const isGuest = guestId === userId

    if (status === 'cancelled' && isGuest && ['pending', 'confirmed'].includes(booking.status)) {
      booking.status = 'cancelled'
    } else if (status === 'declined' && isHost && booking.status === 'pending') {
      booking.status = 'declined'
    } else if (status === 'completed' && isHost && booking.status === 'confirmed') {
      booking.status = 'completed'
    } else {
      res.status(400)
      throw new Error('This status change is not allowed')
    }

    await booking.save()
    res.json({ booking })
  } catch (error) {
    next(error)
  }
}

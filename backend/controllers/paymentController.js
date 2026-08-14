import Stripe from 'stripe'
import Booking from '../models/Booking.js'

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    const error = new Error('Stripe is not configured')
    error.statusCode = 500
    throw error
  }
  return new Stripe(key)
}

const markPaid = async (booking, session) => {
  if (booking.status !== 'pending') return booking
  booking.status = 'confirmed'
  booking.stripeSessionId = session.id
  booking.stripePaymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || ''
  await booking.save()
  return booking
}

export const createCheckout = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.body.bookingId).populate('listingId')
    if (!booking) {
      res.status(404)
      throw new Error('Booking not found')
    }
    if (booking.guestId.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error('Not authorized')
    }
    if (booking.status !== 'pending') {
      res.status(400)
      throw new Error('Only pending bookings can be paid')
    }

    const stripe = getStripe()
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: req.user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: (process.env.STRIPE_CURRENCY || 'inr').toLowerCase(),
            unit_amount: Math.round(booking.totalPrice * 100),
            product_data: { name: booking.listingId?.title || 'StayEase stay' },
          },
        },
      ],
      metadata: { bookingId: booking._id.toString() },
      success_url: `${frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${booking._id}`,
      cancel_url: `${frontendUrl}/payments/cancel?bookingId=${booking._id}`,
    })

    booking.stripeSessionId = session.id
    await booking.save()
    res.json({ url: session.url })
  } catch (error) {
    next(error)
  }
}

export const confirmCheckoutSession = async (req, res, next) => {
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(req.body.sessionId)
    const booking = await Booking.findById(session.metadata?.bookingId).populate('listingId')

    if (!booking) {
      res.status(404)
      throw new Error('Booking not found')
    }
    if (booking.guestId.toString() !== req.user._id.toString()) {
      res.status(403)
      throw new Error('Not authorized')
    }
    if (session.payment_status !== 'paid') {
      res.status(400)
      throw new Error('Payment is not complete')
    }

    await markPaid(booking, session)
    res.json({ booking })
  } catch (error) {
    next(error)
  }
}

export const stripeWebhook = async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return res.status(400).json({ message: 'Webhook not configured' })

  try {
    const stripe = getStripe()
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      secret
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const booking = await Booking.findById(session.metadata?.bookingId)
      if (booking && session.payment_status === 'paid') {
        await markPaid(booking, session)
      }
    }

    res.json({ received: true })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

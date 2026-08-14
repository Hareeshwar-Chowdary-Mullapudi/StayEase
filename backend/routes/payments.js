import express from 'express'
import {
  confirmCheckoutSession,
  createCheckout,
} from '../controllers/paymentController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.post('/create-checkout', protect, createCheckout)
router.post('/confirm', protect, confirmCheckoutSession)
export default router

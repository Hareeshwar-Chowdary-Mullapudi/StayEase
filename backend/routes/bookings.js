import express from 'express'
import {
  createBooking,
  getBookingById,
  getHostBookings,
  getMyBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.get('/host', protect, getHostBookings)
router.get('/:id', protect, getBookingById)
router.patch('/:id/status', protect, updateBookingStatus)
export default router

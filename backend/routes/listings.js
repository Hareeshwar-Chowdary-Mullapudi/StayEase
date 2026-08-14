import express from 'express'
import {
  createListing,
  deleteListing,
  getListingAvailability,
  getListingById,
  getListings,
  updateListing,
} from '../controllers/listingController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.get('/', getListings)
router.get('/:id/availability', getListingAvailability)
router.get('/:id', getListingById)
router.post('/', protect, createListing)
router.put('/:id', protect, updateListing)
router.delete('/:id', protect, deleteListing)
export default router

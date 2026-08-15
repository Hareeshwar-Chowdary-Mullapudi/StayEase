import express from 'express'
import {
  createListing,
  deleteListing,
  getListingAvailability,
  getListingById,
  getListings,
  getMyListings,
  getPendingListings,
  reviewListing,
  updateListing,
} from '../controllers/listingController.js'
import { adminOnly, hostOnly, protect } from '../middleware/auth.js'
import { optionalAuth } from '../middleware/optionalAuth.js'

const router = express.Router()
router.get('/', getListings)
router.get('/mine', protect, hostOnly, getMyListings)
router.get('/pending', protect, adminOnly, getPendingListings)
router.patch('/:id/review', protect, adminOnly, reviewListing)
router.get('/:id/availability', getListingAvailability)
router.get('/:id', optionalAuth, getListingById)
router.post('/', protect, hostOnly, createListing)
router.put('/:id', protect, hostOnly, updateListing)
router.delete('/:id', protect, hostOnly, deleteListing)
export default router

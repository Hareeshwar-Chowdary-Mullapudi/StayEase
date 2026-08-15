import express from 'express'
import { listUsers, setUserRole, switchRole, updateProfile } from '../controllers/userController.js'
import { adminOnly, protect } from '../middleware/auth.js'

const router = express.Router()
router.put('/profile', protect, updateProfile)
router.patch('/role', protect, switchRole)
router.get('/', protect, adminOnly, listUsers)
router.patch('/:id/role', protect, adminOnly, setUserRole)
export default router

import express from 'express'
import { protect } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('Image file is required')
  }

  const base =
    process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`
  res.status(201).json({ url: `${base}/uploads/${req.file.filename}` })
})
export default router

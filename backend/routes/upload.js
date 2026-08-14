import express from 'express'
import { protect } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('Image file is required')
  }
  res.status(201).json({ url: `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}` })
})
export default router

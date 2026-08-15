import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next()
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
  } catch {
    req.user = null
  }
  next()
}

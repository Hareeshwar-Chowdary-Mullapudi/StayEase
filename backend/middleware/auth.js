import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      res.status(401)
      throw new Error('Not authorized')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)

    if (!req.user) {
      res.status(401)
      throw new Error('User not found')
    }

    next()
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(401)
    next(error)
  }
}

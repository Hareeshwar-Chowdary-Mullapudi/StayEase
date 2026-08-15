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

export const hostOnly = (req, res, next) => {
  if (req.user?.role !== 'host' && req.user?.role !== 'admin') {
    res.status(403)
    return next(new Error('Host access only'))
  }
  next()
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403)
    return next(new Error('Admin access only'))
  }
  next()
}

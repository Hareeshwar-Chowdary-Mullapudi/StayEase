import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Name, email, and password are required')
    }

    if (password.length < 6) {
      res.status(400)
      throw new Error('Password must be at least 6 characters')
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      res.status(400)
      throw new Error('User already exists with this email')
    }

    const allowedRoles = ['guest', 'host']
    const userRole = allowedRoles.includes(role) ? role : 'guest'

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: userRole,
    })

    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: user.toSafeObject(),
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400)
      throw new Error('Email and password are required')
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    const token = generateToken(user._id)

    res.json({
      token,
      user: user.toSafeObject(),
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res) => {
  res.json({ user: req.user })
}

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Name, email, and password are required')
    }

    const exists = await User.findOne({ email })
    if (exists) {
      res.status(400)
      throw new Error('Email already registered')
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
    })

    res.status(201).json({ token: makeToken(user._id), user: user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    res.json({ token: makeToken(user._id), user: user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}

export const me = async (req, res) => {
  res.json({ user: req.user.toSafeObject() })
}

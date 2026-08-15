import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const adminEmail = () => process.env.ADMIN_EMAIL?.trim().toLowerCase() || ''
const normalizeEmail = (email = '') => email.trim().toLowerCase()

export const ensureAdminUser = async () => {
  const email = adminEmail()
  if (!email) return
  await User.updateOne({ email }, { $set: { role: 'admin' } })
}

const bootstrapAdmin = async (user) => {
  const email = adminEmail()
  if (email && normalizeEmail(user.email) === email && user.role !== 'admin') {
    user.role = 'admin'
    await user.save()
  }
  return user
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Name, email, and password are required')
    }

    const emailNorm = normalizeEmail(email)
    let nextRole = ['guest', 'host'].includes(role) ? role : 'guest'
    const configuredAdmin = adminEmail()

    if (configuredAdmin && emailNorm === configuredAdmin) {
      nextRole = 'admin'
    } else if (role === 'admin') {
      res.status(403)
      throw new Error('Admin signup is only allowed for the ADMIN_EMAIL in .env')
    }

    const exists = await User.findOne({ email: emailNorm })
    if (exists) {
      res.status(400)
      throw new Error('Email already registered')
    }

    const user = await User.create({
      name,
      email: emailNorm,
      passwordHash: await bcrypt.hash(password, 10),
      role: nextRole,
    })

    await bootstrapAdmin(user)
    res.status(201).json({ token: makeToken(user._id), user: user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: normalizeEmail(email) })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    await bootstrapAdmin(user)
    res.json({ token: makeToken(user._id), user: user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}

export const me = async (req, res, next) => {
  try {
    await bootstrapAdmin(req.user)
    res.json({ user: req.user.toSafeObject() })
  } catch (error) {
    next(error)
  }
}
